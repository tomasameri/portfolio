# Guía de Configuración de API Keys en Appwrite

## 🔑 API Keys vs Dev Keys

En Appwrite, hay dos conceptos relacionados pero diferentes:

### API Keys (Claves de API)
- **Qué son:** Claves de servidor que otorgan permisos administrativos
- **Dónde crearlas:** Appwrite Console → Settings → API Keys
- **Cuándo usarlas:** Para operaciones administrativas desde el servidor (scripts, funciones server-side)
- **Permisos:** Puedes configurar qué scopes tienen (databases, storage, users, etc.)

### Dev Keys (Claves de Desarrollo)
- **Qué son:** Un concepto del SDK de Appwrite, no algo que creas en la consola
- **Cómo funciona:** En el SDK v21.x, el método `.setDevKey()` se usa para configurar API Keys del servidor
- **Importante:** No necesitas crear una "Dev Key" separada - usa una de tus API Keys

## 📝 Configuración Correcta

### Paso 1: Crear una API Key en Appwrite Console

1. Ve a **Appwrite Console → Settings → API Keys**
2. Haz clic en **"Create API Key"**
3. Configura los permisos (scopes):
   - ✅ **Databases** (necesario para crear atributos y documentos)
   - ✅ **Storage** (si necesitas manejar archivos)
   - ✅ **Users** (si necesitas operaciones administrativas de usuarios)
4. Copia la clave generada (solo se muestra una vez)

### Paso 2: Agregar la API Key a tu `.env.local`

```bash
# Agrega esta línea a tu archivo .env.local
APPWRITE_API_KEY=tu-api-key-aqui
```

**⚠️ IMPORTANTE:**
- NO uses el prefijo `NEXT_PUBLIC_` para la API Key
- La API Key es secreta y solo debe estar disponible en el servidor
- Nunca la expongas en el código del cliente

### Paso 3: Usar la API Key en el código

En el SDK de Appwrite v21.x, se usa `.setDevKey()` para configurar API Keys del servidor:

```typescript
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setDevKey(apiKey); // Aquí va tu API Key
```

**Nota:** Aunque el método se llama `setDevKey()`, funciona con API Keys normales. Es un nombre confuso pero es el método correcto para esta versión del SDK.

## 🎯 Cuándo Usar API Keys

### ✅ Usar API Key:
- Scripts de migración (`migrateCards.ts`, `migrateBlogPosts.ts`)
- Scripts de setup (`setupCollections.ts`)
- Operaciones administrativas desde el servidor
- Crear/eliminar colecciones y atributos
- Operaciones que requieren permisos elevados

### ❌ NO usar API Key:
- Operaciones del cliente (navegador)
- Autenticación de usuarios
- Operaciones normales de la aplicación (usar sesiones de usuario)

## 🔒 Seguridad

1. **Nunca expongas la API Key al cliente:**
   ```typescript
   // ❌ MAL - Nunca hagas esto
   const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY;
   
   // ✅ BIEN - Sin prefijo NEXT_PUBLIC_
   const apiKey = process.env.APPWRITE_API_KEY;
   ```

2. **Agrega `.env.local` a `.gitignore`:**
   ```gitignore
   .env.local
   .env*.local
   ```

3. **Para producción:** Configura la API Key como variable de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)

## 📚 Referencias

- [Appwrite API Keys Documentation](https://appwrite.io/docs/advanced/platform/api-keys)
- [Appwrite Server SDK](https://appwrite.io/docs/references/server)

## ❓ Preguntas Frecuentes

**P: ¿Necesito crear una "Dev Key" separada?**
R: No. Usa una de tus API Keys existentes. El método `.setDevKey()` es solo el nombre del método en el SDK.

**P: ¿Puedo usar la misma API Key en desarrollo y producción?**
R: Es mejor crear API Keys separadas para cada entorno por seguridad.

**P: ¿Qué permisos (scopes) necesito?**
R: Para este proyecto:
- **Databases**: Necesario para crear atributos y documentos
- **Storage**: Opcional, solo si manejas archivos
- **Users**: Opcional, solo si necesitas operaciones administrativas de usuarios

