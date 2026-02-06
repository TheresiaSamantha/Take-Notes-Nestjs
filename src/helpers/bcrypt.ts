import * as bcrypt from 'bcrypt';
const salt = 10;

async function samar(input: string) {
  return await bcrypt.hash(input, salt);
}

async function match(input: string, cek: string) {
  return await bcrypt.compare(input, cek);
}

export { samar, match };
