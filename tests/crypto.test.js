const { describe, it } = require("node:test");
const assert = require("node:assert");
const cryptoNative = require("node:crypto");
const { sha256, generarSal, hashContrasena, verificarContrasena, cadenaABytesUtf8 } = require("../frontend/js/crypto.js");

describe("Módulo de Criptografía (crypto.js)", () => {
  describe("sha256() - Compatibilidad y soporte UTF-8", () => {
    it("debe calcular el hash correcto para cadenas ASCII simples", () => {
      const entrada = "sal-docente-1-demo:demo2026";
      const esperado = cryptoNative.createHash("sha256").update(entrada, "utf8").digest("hex");
      assert.strictEqual(sha256(entrada), esperado);
    });

    it("debe calcular el hash correcto para cadenas con caracteres acentuados y UTF-8", () => {
      const entrada = "contraseña123ÁÉÍÓÚñÑ";
      const esperado = cryptoNative.createHash("sha256").update(entrada, "utf8").digest("hex");
      assert.strictEqual(sha256(entrada), esperado);
    });

    it("debe calcular el hash correcto para cadenas con caracteres especiales y emojis", () => {
      const entrada = "¡Hola Mundo! 🔑⚡ 123 @#$";
      const esperado = cryptoNative.createHash("sha256").update(entrada, "utf8").digest("hex");
      assert.strictEqual(sha256(entrada), esperado);
    });

    it("debe calcular el hash correcto para la cadena vacía", () => {
      const entrada = "";
      const esperado = cryptoNative.createHash("sha256").update(entrada, "utf8").digest("hex");
      assert.strictEqual(sha256(entrada), esperado);
    });

    it("debe calcular el hash correcto para cadenas largas (> 512 bits / bloque)", () => {
      const entrada = "a".repeat(1000);
      const esperado = cryptoNative.createHash("sha256").update(entrada, "utf8").digest("hex");
      assert.strictEqual(sha256(entrada), esperado);
    });
  });

  describe("generarSal()", () => {
    it("debe generar una cadena hexadecimal de 32 caracteres (16 bytes)", () => {
      const sal = generarSal();
      assert.strictEqual(typeof sal, "string");
      assert.strictEqual(sal.length, 32);
      assert.match(sal, /^[0-9a-f]{32}$/);
    });

    it("debe generar sales distintas en llamadas consecutivas", () => {
      const sal1 = generarSal();
      const sal2 = generarSal();
      assert.notStrictEqual(sal1, sal2);
    });
  });

  describe("hashContrasena() y verificarContrasena()", () => {
    it("debe verificar correctamente una contraseña válida", () => {
      const contrasena = "MiContraseñaSegura123!";
      const sal = generarSal();
      const hash = hashContrasena(contrasena, sal);

      assert.strictEqual(verificarContrasena(contrasena, sal, hash), true);
    });

    it("debe rechazar una contraseña incorrecta", () => {
      const contrasenaCorrecta = "ClaveValida123";
      const contrasenaErronea = "ClaveErronea123";
      const sal = generarSal();
      const hash = hashContrasena(contrasenaCorrecta, sal);

      assert.strictEqual(verificarContrasena(contrasenaErronea, sal, hash), false);
    });

    it("debe rechazar la verificación cuando faltan parámetros requeridos", () => {
      assert.strictEqual(verificarContrasena(null, "sal", "hash"), false);
      assert.strictEqual(verificarContrasena("pass", "", "hash"), false);
      assert.strictEqual(verificarContrasena("pass", "sal", null), false);
    });
  });
});
