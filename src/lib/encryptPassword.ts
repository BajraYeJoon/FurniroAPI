export default function encryptPassword(password: string): string {
  return CryptoJS.AES.encrypt(password, process.env.PASS_SEC!).toString();
}
