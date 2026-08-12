/**
 * Constantes K para SHA-256 (FIPS 180-4).
 */
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

/**
 * Valores iniciales H de SHA-256.
 */
const SHA256_H_INICIAL = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

/**
 * Rotación a la derecha de un entero de 32 bits sin signo.
 * @param {number} valor - Valor entero de 32 bits.
 * @param {number} cantidad - Cantidad de posiciones a rotar.
 * @returns {number} Resultado de la rotación.
 */
function rotr(valor, cantidad) {
  return (valor >>> cantidad) | (valor << (32 - cantidad));
}

/**
 * Convierte una cadena JavaScript (UTF-16) a un arreglo de bytes UTF-8 (`Uint8Array`).
 * Utiliza `TextEncoder` cuando está disponible o un codificador UTF-8 manual como respaldo.
 * @param {string} str - Cadena de texto a codificar.
 * @returns {Uint8Array} Arreglo de bytes UTF-8.
 */
function cadenaABytesUtf8(str) {
  if (typeof str !== "string") {
    str = String(str ?? "");
  }
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let cp = str.charCodeAt(i);
    if (cp >= 0xd800 && cp <= 0xdbff && i + 1 < str.length) {
      const alto = str.charCodeAt(i + 1);
      if (alto >= 0xdc00 && alto <= 0xdfff) {
        cp = (cp - 0xd800) * 0x400 + (alto - 0xdc00) + 0x10000;
        i++;
      }
    }
    if (cp < 0x80) {
      bytes.push(cp);
    } else if (cp < 0x800) {
      bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else {
      bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

/**
 * Calcula el hash SHA-256 (en formato hexadecimal) para cualquier cadena de texto (incluye UTF-8).
 * @param {string} texto - Texto a hashear.
 * @returns {string} Hash SHA-256 en formato hexadecimal de 64 caracteres.
 */
function sha256(texto) {
  const bytes = cadenaABytesUtf8(texto);
  const lBytes = bytes.length;
  const lBits = lBytes * 8;

  const kZeros = (56 - ((lBytes + 1) % 64) + 64) % 64;
  const totalBytes = lBytes + 1 + kZeros + 8;
  const palabrasCount = totalBytes / 4;
  const palabras = new Int32Array(palabrasCount);

  for (let i = 0; i < lBytes; i++) {
    palabras[i >> 2] |= bytes[i] << ((3 - (i % 4)) * 8);
  }
  palabras[lBytes >> 2] |= 0x80 << ((3 - (lBytes % 4)) * 8);

  const lBitsAlto = Math.floor(lBits / 0x100000000);
  const lBitsBajo = lBits >>> 0;
  palabras[palabrasCount - 2] = lBitsAlto;
  palabras[palabrasCount - 1] = lBitsBajo;

  const hash = SHA256_H_INICIAL.slice();
  const w = new Int32Array(64);

  for (let p = 0; p < palabrasCount; p += 16) {
    for (let i = 0; i < 16; i++) {
      w[i] = palabras[p + i];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  let resultado = "";
  for (let i = 0; i < 8; i++) {
    const hex = (hash[i] >>> 0).toString(16).padStart(8, "0");
    resultado += hex;
  }
  return resultado;
}

/**
 * Genera una sal criptográfica aleatoria de 16 bytes en representación hexadecimal (32 caracteres).
 * @returns {string} Cadena hexadecimal de 32 caracteres.
 */
function generarSal() {
  const bytes = new Uint8Array(16);
  const cryptoObj = typeof globalThis !== "undefined" && globalThis.crypto
    ? globalThis.crypto
    : (typeof window !== "undefined" ? window.crypto : null);

  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Genera el hash de una contraseña utilizando una sal dada.
 * @param {string} contrasena - Contraseña en texto plano.
 * @param {string} sal - Sal para la derivación del hash.
 * @returns {string} Hash SHA-256 de la combinación.
 */
function hashContrasena(contrasena, sal) {
  const pass = String(contrasena ?? "");
  const salt = String(sal ?? "");
  return sha256(`${salt}:${pass}`);
}

/**
 * Verifica si una contraseña coincide con el hash guardado.
 * @param {string} contrasena - Contraseña ingresada.
 * @param {string} sal - Sal guardada.
 * @param {string} hash - Hash guardado a comparar.
 * @returns {boolean} `true` si la contraseña es correcta, `false` en caso contrario.
 */
function verificarContrasena(contrasena, sal, hash) {
  if (!sal || !hash || typeof contrasena !== "string") return false;
  return hashContrasena(contrasena, sal) === hash;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    sha256,
    generarSal,
    hashContrasena,
    verificarContrasena,
    cadenaABytesUtf8
  };
}
