import * as fs from 'fs/promises';

async function loadInput(fileName: string) {
  let data = await fs.readFile(fileName, 'utf-8');
  return data.trim();
}

function parseDiskMap(input: string) {
  let files = [];
  let freeSpace = [];
  let totalSpace = 0;
  let diskMap = [];

  for (let i = 0; i < input.length; i++) {
    const value = parseInt(input[i]);
    if (i % 2 == 0) {
      files.push({ length: value, index: diskMap.length });
      for (let k = 0; k < value; k++) {
        diskMap.push(i / 2);
      }
    } else {
      freeSpace.push({ length: value, index: diskMap.length });
      for (let k = 0; k < value; k++) {
        diskMap.push(null);
      }
    }

    totalSpace += value;
  }
  return { files, freeSpace, totalSpace, diskMap };
}

function compress(diskMap: (number | null)[]) {
  let i = 0;
  let j = diskMap.length;

  while (diskMap[j] == null && j > 0) {
    j--;
  }

  while (i < j) {
    if (diskMap[i] != null) {
      i++;
      continue;
    }

    if (diskMap[j] != null) {
      diskMap[i] = diskMap[j];
      diskMap[j] = null;
      i++;
    }
    j--;
  }
}

function contiguousCompress({
  files,
  freeSpace,
  totalSpace,
  diskMap,
}: {
  files: { length: number; index: number }[];
  freeSpace: { length: number; index: number }[];
  totalSpace: number;
  diskMap: (number | null)[];
}) {
  let fileId = files.length;
  while (files.length > 0) {
    fileId = files.length - 1;
    let { length: fileLength, index: fileIndex } = files.pop()!;

    let freeSpaceId = null;
    for (let i = 0; i < freeSpace.length && i < fileId; i++) {
      if (freeSpace[i].length >= fileLength && freeSpace[i].index < fileIndex) {
        freeSpaceId = i;
        break;
      }
    }

    if (freeSpaceId != null) {
      let freeSpaceIndex = freeSpace[freeSpaceId].index;
      for (let j = 0; j < fileLength; j++) {
        diskMap[freeSpaceIndex] = fileId;
        diskMap[fileIndex] = null;
        fileIndex++;
        freeSpaceIndex++;
      }

      let remainingSpace = freeSpace[freeSpaceId].length - fileLength;
      if (remainingSpace > 0) {
        freeSpace[freeSpaceId].length = remainingSpace;
        freeSpace[freeSpaceId].index = freeSpaceIndex;
      } else {
        freeSpace.splice(freeSpaceId, 1);
      }
    }
  }
}

function contiguousCompressedCheckSum(input: string) {
  let diskMap = parseDiskMap(input);
  contiguousCompress(diskMap);

  return diskMap.diskMap.reduce((p, c, i) => (c ? (p! += c * i) : p), 0);
}

function compressedCheckSum(input: string) {
  let { diskMap } = parseDiskMap(input);
  compress(diskMap);

  return diskMap.reduce((p, c, i) => (c ? (p! += c * i) : p), 0);
}

export {
  loadInput,
  parseDiskMap,
  compress,
  compressedCheckSum,
  contiguousCompress,
  contiguousCompressedCheckSum,
};
