// 确定性 zip writer / reader（无第三方依赖）。
//
// recipe 与 brp 的 octopus-system-artifact-zip/1 / dnd5e fork 出件逐字对齐：
//   store（不压缩）、路径按 UTF-16 code unit 升序、固定 1980-01-01T00:00:00Z DOS 时间戳、
//   0644 常规文件、UTF-8 文件名、无 extra field、无 comment。
// 命名空间独立（arcane-dnd5e-runtime-sdk-zip/1）：字节规则同源，但不得把本仓产物的
// recipe id 与 BRP/dnd5e 的当同一个坐标。
// 同一输入重复构建必须逐字节一致（跨 Node/zlib 版本也不漂移，因为完全不经压缩器）。
import { createHash } from "node:crypto";

export const ZIP_RECIPE = "arcane-dnd5e-runtime-sdk-zip/1: store, paths sorted (code-unit order), "
  + "fixed 1980-01-01T00:00:00Z DOS timestamp, 0644 regular files, UTF-8 names";

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIZE = 46;
const EOCD_SIZE = 22;
const DOS_TIME = 0;
const DOS_DATE = 0x21; // 1980-01-01
const UTF8_FLAG = 0x0800;
const VERSION_NEEDED = 20;
const VERSION_MADE_BY = 0x0314; // Unix, zip 2.0
const EXTERNAL_ATTR = (0o100644 << 16) >>> 0;

export const sha256Hex = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const byPath = (a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);

// entries: [{ path, bytes }]
export const makeZip = (entries) => {
  const ordered = [...entries].sort(byPath);
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const file of ordered) {
    const name = Buffer.from(file.path, "utf8");
    const data = file.bytes;
    const crc = crc32(data);

    const local = Buffer.alloc(LOCAL_HEADER_SIZE);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(VERSION_NEEDED, 4);
    local.writeUInt16LE(UTF8_FLAG, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);

    const cd = Buffer.alloc(CENTRAL_HEADER_SIZE);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(VERSION_MADE_BY, 4);
    cd.writeUInt16LE(VERSION_NEEDED, 6);
    cd.writeUInt16LE(UTF8_FLAG, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(DOS_TIME, 12);
    cd.writeUInt16LE(DOS_DATE, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(name.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(EXTERNAL_ATTR, 38);
    cd.writeUInt32LE(offset, 42);

    chunks.push(local, name, data);
    central.push(cd, name);
    offset += local.length + name.length + data.length;
  }

  const centralBytes = Buffer.concat(central);
  const eocd = Buffer.alloc(EOCD_SIZE);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(ordered.length, 8);
  eocd.writeUInt16LE(ordered.length, 10);
  eocd.writeUInt32LE(centralBytes.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, centralBytes, eocd]);
};

// 只解析本 recipe 产生的 zip；任何方法/标志/时间戳/次序不符都记为漂移。
export const readZip = (bytes) => {
  const problems = [];
  if (bytes.length < EOCD_SIZE) return { problems: ["zip 小于 EOCD 长度"], entries: [] };
  const eocdOffset = bytes.length - EOCD_SIZE;
  if (bytes.readUInt32LE(eocdOffset) !== 0x06054b50) {
    return { problems: ["zip 末尾不是 EOCD（不允许 comment）"], entries: [] };
  }
  if (bytes.readUInt16LE(eocdOffset + 4) !== 0 || bytes.readUInt16LE(eocdOffset + 6) !== 0) {
    problems.push("zip 使用了多磁盘字段");
  }
  const entryCount = bytes.readUInt16LE(eocdOffset + 10);
  const centralSize = bytes.readUInt32LE(eocdOffset + 12);
  const centralOffset = bytes.readUInt32LE(eocdOffset + 16);
  if (centralOffset + centralSize !== eocdOffset) problems.push("zip central directory 边界与 EOCD 不符");

  let cursor = centralOffset;
  const entries = [];
  for (let index = 0; index < entryCount; index += 1) {
    if (cursor + CENTRAL_HEADER_SIZE > bytes.length || bytes.readUInt32LE(cursor) !== 0x02014b50) {
      problems.push(`zip central 第 ${index} 条签名非法`);
      break;
    }
    const method = bytes.readUInt16LE(cursor + 10);
    const flags = bytes.readUInt16LE(cursor + 8);
    const time = bytes.readUInt16LE(cursor + 12);
    const date = bytes.readUInt16LE(cursor + 14);
    const crc = bytes.readUInt32LE(cursor + 16);
    const compressedSize = bytes.readUInt32LE(cursor + 20);
    const uncompressedSize = bytes.readUInt32LE(cursor + 24);
    const nameLength = bytes.readUInt16LE(cursor + 28);
    const extraLength = bytes.readUInt16LE(cursor + 30);
    const commentLength = bytes.readUInt16LE(cursor + 32);
    const localOffset = bytes.readUInt32LE(cursor + 42);
    const nameStart = cursor + CENTRAL_HEADER_SIZE;
    const name = bytes.toString("utf8", nameStart, nameStart + nameLength);
    if (method !== 0) problems.push(`zip 条目不是 store: ${name}`);
    if (flags !== UTF8_FLAG) problems.push(`zip 条目 flags 非预期: ${name}`);
    if (time !== DOS_TIME || date !== DOS_DATE) problems.push(`zip 条目时间戳非固定值: ${name}`);
    if (compressedSize !== uncompressedSize) problems.push(`zip 条目压缩大小不一致: ${name}`);
    if (localOffset + LOCAL_HEADER_SIZE > bytes.length || bytes.readUInt32LE(localOffset) !== 0x04034b50) {
      problems.push(`zip local 头非法: ${name}`);
      cursor += CENTRAL_HEADER_SIZE + nameLength + extraLength + commentLength;
      continue;
    }
    const localNameLength = bytes.readUInt16LE(localOffset + 26);
    const localExtraLength = bytes.readUInt16LE(localOffset + 28);
    const localName = bytes.toString("utf8", localOffset + LOCAL_HEADER_SIZE,
      localOffset + LOCAL_HEADER_SIZE + localNameLength);
    if (localName !== name) problems.push(`zip local/central 文件名不一致: ${name}`);
    if (bytes.readUInt16LE(localOffset + 6) !== UTF8_FLAG) problems.push(`zip local flags 非预期: ${name}`);
    if (bytes.readUInt16LE(localOffset + 8) !== 0) problems.push(`zip local 压缩方法非 store: ${name}`);
    if (bytes.readUInt16LE(localOffset + 10) !== DOS_TIME || bytes.readUInt16LE(localOffset + 12) !== DOS_DATE) {
      problems.push(`zip local 时间戳非固定值: ${name}`);
    }
    if (bytes.readUInt32LE(localOffset + 14) !== crc) problems.push(`zip local crc 不一致: ${name}`);
    if (bytes.readUInt32LE(localOffset + 18) !== compressedSize
      || bytes.readUInt32LE(localOffset + 22) !== uncompressedSize) {
      problems.push(`zip local 大小不一致: ${name}`);
    }
    const dataStart = localOffset + LOCAL_HEADER_SIZE + localNameLength + localExtraLength;
    const data = bytes.subarray(dataStart, dataStart + compressedSize);
    if (data.length !== compressedSize) problems.push(`zip 条目数据越界: ${name}`);
    if (crc32(data) !== crc) problems.push(`zip 条目 crc 校验失败: ${name}`);
    entries.push({ path: name, size: uncompressedSize, sha256: sha256Hex(data), bytes: data });
    cursor += CENTRAL_HEADER_SIZE + nameLength + extraLength + commentLength;
  }
  if (cursor !== centralOffset + centralSize) problems.push("zip central directory 未被完整解析");
  return { problems, entries };
};
