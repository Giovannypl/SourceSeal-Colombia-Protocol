# Protocolo de Auditoría ZKP de SourceSeal

## Introducción
SourceSeal implementa un sistema de auditoría de integridad basado en **Pruebas de Conocimiento Cero (Zero-Knowledge Proofs - ZKP)**. Este protocolo permite que autoridades judiciales o auditores externos verifiquen la veracidad y la integridad de los eventos de seguridad registrados sin comprometer la privacidad de los datos subyacentes.

## Arquitectura Criptográfica
El sistema utiliza el protocolo **Groth16** a través de la librería **snarkjs** para garantizar tres propiedades fundamentales:

1.  **Integridad:** Cualquier alteración en los logs de los Honeytokens invalidará automáticamente la prueba criptográfica.
2.  **Privacidad:** El auditor solo recibe una prueba matemática (`proof`) y una señal pública (`contentHash`), pero nunca el contenido sensible original.
3.  **No Repudio:** Una vez generado el sello, no puede ser negado por el sistema sin romper la cadena de confianza criptográfica.

## Cumplimiento de la Ley 1978 (Colombia)
Este protocolo está diseñado específicamente para cumplir con los estándares de la **Ley 1978 de 2019**, asegurando que:

- **Protección de la Privacidad:** Se protege la identidad y los datos de los ciudadanos al no exponer información innecesaria durante procesos de auditoría.
- **Transparencia Judicial:** Proporciona a la Fiscalía y otras autoridades herramientas de verificación matemática irrefutables para procesos legales.
- **Responsabilidad TIC:** Los proveedores de contenido mantienen un registro íntegro y verificable de su actuar ético y legal.

## Proceso de Auditoría
1.  **Generación:** Al dispararse un Honeytoken, se genera un `contentHash` y se almacena en los metadatos del evento.
2.  **Prueba:** Se genera una prueba ZKP utilizando un secreto efímero y el hash del contenido.
3.  **Verificación:** El auditor envía la prueba al endpoint `/api/verify-integrity`, el cual confirma mediante `snarkjs` si la prueba es válida para el evento registrado en la base de datos.
