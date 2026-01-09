# Shared Scripts Library

This folder contains reusable scripts that can be shared across multiple projects using the Memory Bank system.

## 📋 Available Scripts

### 🔗 Link Management Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `create-links.bat` | Windows (Batch) | Creates symbolic links for memory-bank files |
| `create-links.ps1` | Windows (PowerShell) | Creates symbolic links for memory-bank files |
| `setup-links-admin.bat` | Windows (Batch) | Sets up admin-level symbolic links |
| `setup-links-admin.ps1` | Windows (PowerShell) | Sets up admin-level symbolic links |
| `verify-links.ps1` | Windows (PowerShell) | Verifies that all memory-bank links are working |

### 🛠️ Project Setup Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `setup-new-project.bat` | Windows (Batch) | Initializes memory-bank system for new projects |
| `setup-new-project.sh` | Unix/Linux/macOS (Shell) | Initializes memory-bank system for new projects |
| `setup-status.ps1` | Windows (PowerShell) | Shows current memory-bank setup status |

### 🔄 Synchronization Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `sync-from-core.ps1` | Windows (PowerShell) | Synchronizes files from the central memory-bank-core |

### 📦 Script Management Scripts

| Script | Platform | Purpose |
|--------|----------|---------|
| `copy-scripts.ps1` | Windows (PowerShell) | Copies shared scripts to target projects |

## 🚀 Usage

### For New Projects

1. Copy the appropriate setup script to your new project:
   ```bash
   # For Windows projects
   cp shared-scripts/setup-new-project.bat /path/to/new/project/

   # For Unix/Linux/macOS projects
   cp shared-scripts/setup-new-project.sh /path/to/new/project/
   ```

2. Run the setup script in the new project directory

### For Existing Projects

1. Copy needed utility scripts:
   ```bash
   cp shared-scripts/verify-links.ps1 /path/to/project/
   cp shared-scripts/sync-from-core.ps1 /path/to/project/
   ```

2. Run scripts as needed for maintenance

## 📁 Script Categories

### Link Management
Scripts for creating and maintaining symbolic links between projects and the memory-bank system.

### Project Setup
Scripts for initializing new projects with the memory-bank system.

### Synchronization
Scripts for keeping projects synchronized with the central memory-bank-core repository.

## 🔧 Contributing

When adding new reusable scripts:

1. Add the script to this `shared-scripts/` folder
2. Update this README.md with the new script information
3. Ensure the script has proper documentation/comments
4. Test the script on multiple platforms if applicable

## 📝 Notes

- All scripts should be platform-agnostic where possible
- Include both `.bat` and `.ps1` versions for Windows scripts when applicable
- Scripts should handle errors gracefully and provide helpful error messages
- Update the Memory Bank config when adding new script categories