import * as bcrypt from 'bcrypt';

// Usar algoritmo salt con 10 rondas por defecto
export const hashData = (data: string): string => {
  return bcrypt.hashSync(String(data), 10);
};

// Comparar la constraseña brindada por el usuariocon la contraseña almacenada
export const comparePlainWithHash = (
  plainText: any,
  hashedText: string,
): boolean => {
  return bcrypt.compareSync(String(plainText), hashedText);
};

// Comparar contraseña almacenada con la brindada por el usuario
export const compareHashWithPlain = (
  hashedText: string,
  plainText: string,
): boolean => {
  return bcrypt.compareSync(hashedText, String(plainText));
};
