# Appwrite: Tables vs Collections - Guía de Migración

## 🔍 Problema Identificado

Estás usando la **nueva API de Appwrite (Tables/Columns)** pero el código está configurado para la **API Legacy (Collections/Attributes)**.

## 📊 Diferencias entre las APIs

### API Legacy (Collections/Attributes)
- Usa `Databases` service
- Estructura: Database → Collections → Attributes → Documents
- Métodos: `createStringAttribute()`, `createIntegerAttribute()`, etc.
- SDK: `appwrite` package (v21.x)

### Nueva API (Tables/Columns)  
- Usa `TablesDB` service
- Estructura: Database → Tables → Columns → Rows
- Métodos: `createTable()` con columns definidas al crear
- SDK: `node-appwrite` package (para servidor)

## ⚠️ Tu Situación Actual

Según la documentación que compartiste, estás usando la nueva interfaz de Tables en Appwrite Console, pero:
1. El código usa `Databases` (API Legacy)
2. Los scripts intentan crear "Attributes" pero necesitan crear "Columns"
3. El SDK `appwrite` v21.5.0 soporta Collections, pero para Tables necesitas `node-appwrite`

## ✅ Soluciones Posibles

### Opción 1: Usar API Legacy (Collections) - RECOMENDADO

Si quieres mantener el código actual, necesitas crear **Collections** en lugar de Tables:

1. Ve a Appwrite Console → Databases → Tu Base de Datos
2. Busca si hay una opción para crear "Collections" (no Tables)
3. O verifica si puedes migrar de Tables a Collections

### Opción 2: Migrar a Nueva API (Tables)

Si prefieres usar la nueva API de Tables, necesitarías:

1. Instalar `node-appwrite` para scripts del servidor
2. Actualizar el código para usar `TablesDB` en lugar de `Databases`
3. Cambiar todos los métodos de `createDocument` a `createRow`
4. Actualizar los scripts de setup

## 🎯 Recomendación

**Usa la API Legacy (Collections)** porque:
- Tu código ya está configurado para ella
- El SDK `appwrite` v21.5.0 la soporta completamente
- Es más estable y tiene más documentación
- No requiere cambios mayores en el código

## 📝 Próximos Pasos

1. **Verifica en Appwrite Console:**
   - Ve a Databases → Tu Base de Datos
   - ¿Ves "Collections" o "Tables"?
   - Si ves "Tables", necesitas crear "Collections" en su lugar

2. **Si solo ves Tables:**
   - Puede que tu proyecto esté usando la nueva API por defecto
   - Necesitarás crear Collections manualmente o migrar el código

3. **Ejecuta el script de setup:**
   ```bash
   npx tsx scripts/setupCollections.ts
   ```
   Esto debería crear los Attributes si estás usando Collections.

## 🔗 Referencias

- [Appwrite Tables Documentation](https://appwrite.io/docs/products/databases)
- [Appwrite Legacy API](https://appwrite.io/docs/references/legacy-api)

