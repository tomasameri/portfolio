#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Crear directorio dist si no existe
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Función para copiar recursivamente
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copiar .next a dist/.next
const nextDir = path.join(process.cwd(), '.next');
const distNextDir = path.join(distDir, '.next');

if (fs.existsSync(nextDir)) {
  // Eliminar dist/.next si existe antes de copiar
  if (fs.existsSync(distNextDir)) {
    fs.rmSync(distNextDir, { recursive: true, force: true });
  }
  copyRecursiveSync(nextDir, distNextDir);
  console.log('✓ Copied .next to dist/.next');
} else {
  console.warn('⚠ Warning: .next directory not found. Make sure to run "next build" first.');
}

// Copiar public a dist/public si existe
const publicDir = path.join(process.cwd(), 'public');
const distPublicDir = path.join(distDir, 'public');

if (fs.existsSync(publicDir)) {
  copyRecursiveSync(publicDir, distPublicDir);
  console.log('✓ Copied public to dist/public');
}

// Copiar package.json y otros archivos necesarios
const filesToCopy = ['package.json'];
filesToCopy.forEach(file => {
  const src = path.join(process.cwd(), file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} to dist/`);
  }
});

// Crear un archivo .next en dist que apunte al directorio .next de la raíz
// Esto permite que next start funcione desde dist
try {
  // Crear un symlink simbólico si es posible, sino copiar
  const nextLinkPath = path.join(distDir, '.next');
  if (fs.existsSync(nextLinkPath)) {
    fs.rmSync(nextLinkPath, { recursive: true, force: true });
  }
  // En lugar de symlink, copiamos directamente (más compatible)
  // El .next ya fue copiado arriba como dist/.next
  console.log('✓ Setup complete for dist directory');
} catch (error) {
  console.error('Error setting up dist:', error.message);
}

console.log('✓ Post-build script completed');

