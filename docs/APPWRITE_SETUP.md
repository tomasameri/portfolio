# Guía de Configuración de Appwrite

Esta guía te ayudará a configurar correctamente las colecciones en Appwrite para que el proyecto funcione.

## 🚀 Configuración Automática (Recomendado)

**¡Buenas noticias!** Puedes configurar todos los atributos automáticamente con un script:

### ⚠️ IMPORTANTE: Collections vs Tables

Este proyecto usa la **API Legacy de Appwrite (Collections/Attributes)**, no la nueva API (Tables/Columns).

**Si ves "Tables" en Appwrite Console, necesitas crear "Collections" en su lugar.**

### Pasos para configuración automática:

1. **Verifica que tienes Collections (no Tables):**
   - Ve a **Appwrite Console → Databases → Tu Base de Datos**
   - Debes ver **"Collections"** (no "Tables")
   - Si solo ves "Tables", necesitas crear Collections manualmente

2. **Crea las Collections si no existen:**
   - Haz clic en **"Create Collection"** (no "Create Table")
   - Crea dos collections:
     - `cards` (o usa el ID que tengas configurado)
     - `blogPosts` (o usa el ID que tengas configurado)

3. **Obtén tu API Key de Appwrite:**
   - Ve a **Appwrite Console → Settings → API Keys**
   - Crea una nueva API Key con permisos de **"Administrator"** o al menos **"Databases"**
   - Copia la clave generada

4. **Agrega la API Key a tu `.env.local`:**
   ```bash
   APPWRITE_API_KEY=tu-api-key-aqui
   ```

5. **Ejecuta el script de verificación primero:**
   ```bash
   npx tsx scripts/checkAppwriteAPI.ts
   ```
   Esto te dirá qué Collections tienes y qué atributos faltan.

6. **Ejecuta el script de configuración:**
   ```bash
   npx tsx scripts/setupCollections.ts
   ```

El script creará automáticamente todos los atributos necesarios para ambas colecciones. Si algún atributo ya existe, lo omitirá automáticamente.

---

## 📝 Configuración Manual (Alternativa)

Si prefieres configurar los atributos manualmente o el script automático no funciona, sigue las instrucciones a continuación.

## ⚠️ Problema Común: "Unknown attribute"

Si recibes errores como `Invalid document structure: Unknown attribute: "title"` o `Unknown attribute: "type"`, significa que los atributos no están definidos en las colecciones de Appwrite.

## Configuración de Colecciones

### 1. Colección `cards` (o el ID que uses para cards)

Ve a **Appwrite Console → Databases → Tu Base de Datos → Collections → Tu Colección de Cards → Attributes**

Crea los siguientes atributos en este orden:

#### Atributos Requeridos:

1. **type** (String)
   - Key: `type`
   - Size: 50
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

2. **size** (String)
   - Key: `size`
   - Size: 20
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

3. **title** (String)
   - Key: `title`
   - Size: 500
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

4. **description** (String)
   - Key: `description`
   - Size: 1000
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

5. **url** (String)
   - Key: `url`
   - Size: 2000
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

6. **socialPlatform** (String)
   - Key: `socialPlatform`
   - Size: 50
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

7. **image** (String)
   - Key: `image`
   - Size: 500
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

8. **icon** (String)
   - Key: `icon`
   - Size: 500
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

9. **order** (Integer)
   - Key: `order`
   - Required: ✅ Sí
   - Array: ❌ No
   - Min: 0
   - Max: 9999
   - Default: 0

**Nota:** Los atributos `createdAt` y `updatedAt` se crean automáticamente por Appwrite, no necesitas crearlos manualmente.

---

### 2. Colección `blogPosts` (o el ID que uses para blog)

Ve a **Appwrite Console → Databases → Tu Base de Datos → Collections → Tu Colección de Blog → Attributes**

Crea los siguientes atributos:

#### Atributos Requeridos:

1. **title** (String)
   - Key: `title`
   - Size: 500
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

2. **slug** (String)
   - Key: `slug`
   - Size: 500
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)
   - **Importante:** Después de crear este atributo, ve a **Settings → Indexes** y crea un índice único para `slug`

3. **excerpt** (String)
   - Key: `excerpt`
   - Size: 1000
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

4. **content** (String)
   - Key: `content`
   - Size: 100000 (o más, según necesites)
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

5. **published** (Boolean)
   - Key: `published`
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: `false`

6. **publishedAt** (String)
   - Key: `publishedAt`
   - Size: 100
   - Required: ❌ No (opcional)
   - Array: ❌ No
   - Default: (vacío)

7. **authorId** (String)
   - Key: `authorId`
   - Size: 100
   - Required: ✅ Sí
   - Array: ❌ No
   - Default: (vacío)

**Nota:** Los atributos `createdAt` y `updatedAt` se crean automáticamente por Appwrite.

---

## Configuración de Índices

### Para la colección `blogPosts`:

1. Ve a **Settings → Indexes**
2. Crea un índice único para `slug`:
   - Key: `slug_unique`
   - Type: **Unique**
   - Attributes: `slug`

Esto asegura que cada post tenga un slug único.

---

## Configuración de Permisos

### Para ambas colecciones:

1. Ve a **Settings → Permissions**

#### Colección `cards`:
- **Read**: 
  - ✅ `any` (para lectura pública)
  - ✅ `users` (para usuarios autenticados)
- **Create, Update, Delete**: 
  - ✅ `users` (solo usuarios autenticados)

#### Colección `blogPosts`:
- **Read**: 
  - ✅ `any` (para lectura pública de posts publicados)
  - ✅ `users` (para usuarios autenticados)
- **Create, Update, Delete**: 
  - ✅ `users` (solo usuarios autenticados)

---

## Verificación

Después de configurar los atributos:

1. Intenta crear una card desde el panel de administración
2. Intenta crear un post de blog
3. Si aún recibes errores, verifica que:
   - Los nombres de los atributos coincidan exactamente (case-sensitive)
   - Los tipos de datos sean correctos
   - Los atributos requeridos estén marcados como requeridos

---

## Solución Rápida

Si ya tienes datos en las colecciones y necesitas agregar atributos:

1. Los atributos nuevos se pueden agregar sin perder datos existentes
2. Los documentos existentes tendrán valores `null` o el valor por defecto para los nuevos atributos
3. Puedes actualizar los documentos existentes después de agregar los atributos

---

## Notas Importantes

- Los nombres de los atributos son **case-sensitive** (mayúsculas/minúsculas importan)
- Los atributos `createdAt` y `updatedAt` son automáticos, no los crees manualmente
- El tamaño máximo de String en Appwrite es 1MB por defecto
- Los índices ayudan con las búsquedas y validaciones únicas

