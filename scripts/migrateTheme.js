#!/usr/bin/env node
/**
 * Automated Theme Migration Script
 * Converts hardcoded dark mode classes to theme-aware classes
 * 
 * Usage: node scripts/migrateTheme.js <file-path>
 * Example: node scripts/migrateTheme.js src/pages/LandingPage.tsx
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const themeClassMap = {
  // Background colors
  'bg-gray-900': 'bg-theme-bg-primary',
  'bg-gray-800': 'bg-theme-bg-secondary',
  'bg-gray-700': 'bg-theme-bg-tertiary',
  'bg-gray-900/95': 'bg-theme-bg-primary/95',
  'bg-gray-900/98': 'bg-theme-bg-primary/98',
  'bg-gray-900/90': 'bg-theme-bg-primary/90',
  'bg-gray-900/80': 'bg-theme-bg-primary/80',
  'bg-gray-800/50': 'bg-theme-bg-secondary/50',
  'bg-gray-800/70': 'bg-theme-bg-secondary/70',
  
  // Text colors
  'text-white': 'text-theme-text-primary',
  'text-gray-400': 'text-theme-text-tertiary',
  'text-gray-300': 'text-theme-text-secondary',
  'text-gray-500': 'text-theme-text-tertiary',
  
  // Border colors
  'border-gray-800': 'border-theme-border-primary',
  'border-gray-700': 'border-theme-border-primary',
  'border-gray-800/50': 'border-theme-border-primary/50',
  'border-gray-700/50': 'border-theme-border-primary/50',
  'border-gray-600/50': 'border-theme-border-secondary/50',
  
  // Hover states
  'hover:bg-gray-800/50': 'hover:bg-theme-hover/50',
  'hover:bg-gray-800': 'hover:bg-theme-hover',
  'hover:bg-gray-700/50': 'hover:bg-theme-hover/50',
  'hover:text-white': 'hover:text-theme-text-primary',
};

function migrateFile(filePath) {
  try {
    const fullPath = resolve(process.cwd(), filePath);
    console.log(`📝 Migrating: ${filePath}`);
    
    let content = readFileSync(fullPath, 'utf8');
    let changeCount = 0;
    
    // Replace each class
    Object.entries(themeClassMap).forEach(([oldClass, newClass]) => {
      const regex = new RegExp(oldClass.replace(/\//g, '\\/'), 'g');
      const matches = content.match(regex);
      if (matches) {
        changeCount += matches.length;
        content = content.replace(regex, newClass);
      }
    });
    
    if (changeCount > 0) {
      writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Migrated ${changeCount} classes in ${filePath}`);
    } else {
      console.log(`⚠️  No changes needed in ${filePath}`);
    }
    
    return changeCount;
  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
    return 0;
  }
}

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.log(`
Usage: node scripts/migrateTheme.js <file-path>

Examples:
  node scripts/migrateTheme.js src/pages/LandingPage.tsx
  node scripts/migrateTheme.js src/components/Header.tsx

This script will automatically convert hardcoded dark mode classes
to theme-aware classes that work in both light and dark modes.
  `);
  process.exit(1);
}

migrateFile(filePath);
