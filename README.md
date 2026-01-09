# Memory Bank Core

The central repository for shared Memory Bank configurations, mechanisms, templates, and reusable scripts across all projects.

## 📁 Core Structure

```
.memory-bank-core/
├── config.json              # Master configuration file
├── shared-scripts/          # Cross-project reusable scripts
├── mechanisms/              # Workflow automation mechanisms
├── rules/                   # Development rules and guidelines
├── templates/               # Task execution templates
├── taskTemplateSystem.md    # Template system documentation
├── mechanisms-setup-guide.md
├── planner.md
└── README.md               # This file
```

## 🔧 Shared Scripts System

### Overview
The `shared-scripts/` folder contains reusable scripts that can be distributed across multiple projects, eliminating duplication and ensuring consistency.

### Script Categories

#### 🔗 Link Management Scripts
- `create-links.bat/ps1` - Create symbolic links for memory-bank files
- `setup-links-admin.bat/ps1` - Admin-level link setup
- `verify-links.ps1` - Verify link integrity

#### 🛠️ Project Setup Scripts
- `setup-new-project.bat/sh` - Initialize new projects with memory-bank
- `setup-status.ps1` - Check setup status

#### 🔄 Synchronization Scripts
- `sync-from-core.ps1` - Sync mechanisms/rules/templates from core

#### 📦 Script Management Scripts
- `copy-scripts.ps1` - Distribute scripts to target projects

### Usage

#### For New Projects
```powershell
# Copy setup scripts to new project
.\copy-scripts.ps1 -TargetPath "C:\NewProject" -Category "project_setup"
```

#### For Existing Projects
```powershell
# Add utility scripts as needed
.\copy-scripts.ps1 -TargetPath "../other-project" -Category "link_management" -Platform "windows"
```

## 🔄 Synchronization

Projects can sync from the core using the `sync-from-core.ps1` script:

```powershell
# From project memory-bank directory
.\shared-scripts\sync-from-core.ps1
```

This syncs:
- ✅ Mechanisms (workflow automation)
- ✅ Rules (development guidelines)
- ✅ Templates (task execution patterns)
- ✅ Shared Scripts (reusable utilities)

## ⚙️ Configuration

The `config.json` file contains:
- **Shared Scripts Configuration** - Categories and distribution settings
- **Mechanism Settings** - Enabled/disabled workflow features
- **Rule Definitions** - Development guidelines and enforcement
- **Task Templates** - Standardized task execution patterns

## 🚀 Getting Started

### For New Projects
1. Copy setup scripts from `shared-scripts/`
2. Run setup script in new project directory
3. Sync additional components as needed

### For Existing Projects
1. Use `copy-scripts.ps1` to add needed utilities
2. Run `sync-from-core.ps1` to update mechanisms/rules/templates
3. Update local configurations as needed

## 📝 Contributing

### Adding New Scripts
1. Add script to appropriate category in `shared-scripts/`
2. Update `shared-scripts/README.md` with documentation
3. Update `config.json` shared_scripts.categories
4. Test script distribution with `copy-scripts.ps1`

### Updating Mechanisms/Rules
1. Modify files in respective directories
2. Update `config.json` if new settings are added
3. Test synchronization with `sync-from-core.ps1`

## 🔄 Version History

- **v2.1.0** (2025-12-13) - Added shared-scripts system for cross-project script sharing
- **v2.0.0** - Initial core repository structure

## 📞 Support

For issues with the core system:
1. Check `config.json` for configuration issues
2. Verify script permissions and paths
3. Ensure PowerShell execution policy allows script running
4. Check synchronization logs for errors
