function HandelConvUuid(uuid) {
  return parseInt(uuid.replaceAll("-", "").slice(-8), 16);
}

const distribution = [0, 0, 0, 0];

for (let i = 0; i < 2000; i++) {
  const uuid = crypto.randomUUID();
  const index = HandelConvUuid(uuid) % 4;

  distribution[index]++;
}

console.log(distribution);