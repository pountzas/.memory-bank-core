#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ReactComponentScaffolder {
  constructor() {
    this.config = require("./config.json");
    this.templatesDir = path.join(__dirname, "templates");
  }

  generateComponent(componentName, componentType = "ui", features = []) {
    console.log(`🚀 Generating ${componentType} component: ${componentName}`);

    // Validate component type
    if (!this.config.configuration.component_types[componentType]) {
      throw new Error(`Unknown component type: ${componentType}`);
    }

    // Merge features with defaults
    const defaultFeatures = this.config.configuration.default_features;
    const allFeatures = [...new Set([...defaultFeatures, ...features])];

    // Create component directory - detect project structure
    const projectRoot = process.cwd();
    let componentsBasePath;

    // Check if src/components exists (pages router structure)
    if (fs.existsSync(path.join(projectRoot, "src", "components"))) {
      componentsBasePath = path.join(projectRoot, "src", "components");
    }
    // Check if components exists at root (app router structure)
    else if (fs.existsSync(path.join(projectRoot, "components"))) {
      componentsBasePath = path.join(projectRoot, "components");
    }
    // Default to src/components
    else {
      componentsBasePath = path.join(projectRoot, "src", "components");
    }

    const componentDir = path.join(
      componentsBasePath,
      componentName.toLowerCase()
    );

    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // Generate component files
    this.generateComponentFile(
      componentName,
      componentType,
      componentDir,
      allFeatures
    );
    this.generateTypesFile(componentName, componentType, componentDir);
    this.generateStylesFile(componentName, componentType, componentDir);
    this.generateTestFile(componentName, componentType, componentDir);

    // Only generate Storybook stories if Storybook is available
    try {
      require.resolve("@storybook/react");
      this.generateStoriesFile(componentName, componentType, componentDir);
    } catch {
      console.log(
        "ℹ️  Skipping Storybook story generation (Storybook not installed)"
      );
    }

    this.generateDocsFile(componentName, componentType, componentDir);
    this.generateIndexFile(componentName, componentDir);

    console.log(`✅ Component ${componentName} generated successfully!`);
  }

  generateComponentFile(componentName, componentType, componentDir, features) {
    const templatePath = path.join(
      this.templatesDir,
      `${componentType}-component.tsx`
    );
    let template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders
    template = template.replace(/\{\{componentName\}\}/g, componentName);
    template = template.replace(
      /\{\{componentName \| camelCase\}\}/g,
      this.toCamelCase(componentName)
    );
    template = template.replace(
      /\{\{htmlElement\}\}/g,
      this.getHTMLElement(componentType)
    );

    // Add feature-specific code
    if (features.includes("typescript")) {
      // TypeScript is already included
    }

    if (features.includes("styled")) {
      template = this.addStyledFeatures(template, componentName);
    }

    if (features.includes("responsive")) {
      template = this.addResponsiveFeatures(template, componentName);
    }

    if (features.includes("accessible")) {
      template = this.addAccessibilityFeatures(template, componentName);
    }

    const filePath = path.join(componentDir, `${componentName}.tsx`);
    fs.writeFileSync(filePath, template);
  }

  generateTypesFile(componentName, componentType, componentDir) {
    const typesTemplate = `export interface ${componentName}Props {
  // Add component-specific props here
}

export interface ${componentName}State {
  // Add component state interface here
}
`;

    const filePath = path.join(componentDir, "types.ts");
    fs.writeFileSync(filePath, typesTemplate);
  }

  generateStylesFile(componentName, componentType, componentDir) {
    // Skip CSS file generation when using Tailwind CSS
    console.log(
      `ℹ️  Skipping CSS module generation for ${componentName} (using Tailwind CSS)`
    );
  }

  generateTestFile(componentName, componentType, componentDir) {
    const testTemplate = `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName}>Test Content</${componentName}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<${componentName}>Test</${componentName}>);
    expect(container.firstChild).toHaveClass('${this.toCamelCase(
      componentName
    )}');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<${componentName} onClick={handleClick}>Click me</${componentName}>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible', () => {
    render(<${componentName}>Accessible content</${componentName}>);
    expect(screen.getByText('Accessible content')).toBeInTheDocument();
  });
});
`;

    const filePath = path.join(componentDir, `${componentName}.test.tsx`);
    fs.writeFileSync(filePath, testTemplate);
  }

  generateStoriesFile(componentName, componentType, componentDir) {
    const storiesTemplate = `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '${componentName} Component',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: '${componentName} Component',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small ${componentName}',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large ${componentName}',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Disabled ${componentName}',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Loading ${componentName}',
  },
};
`;

    const filePath = path.join(componentDir, `${componentName}.stories.tsx`);
    fs.writeFileSync(filePath, storiesTemplate);
  }

  generateDocsFile(componentName, componentType, componentDir) {
    const docsTemplate = `# ${componentName}

A ${componentType} component for [describe purpose].

## Usage

\`\`\`tsx
import { ${componentName} } from '@/components/${componentName.toLowerCase()}';

function MyComponent() {
  return (
    <${componentName}>
      Content goes here
    </${componentName}>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | The content to display |
| variant | 'primary' \\| 'secondary' \\| 'outline' \\| 'ghost' | 'primary' | The visual variant |
| size | 'sm' \\| 'md' \\| 'lg' | 'md' | The size variant |
| disabled | boolean | false | Whether the component is disabled |
| loading | boolean | false | Whether to show loading state |

## Examples

### Basic Usage

\`\`\`tsx
<${componentName}>Hello World</${componentName}>
\`\`\`

### With Variants

\`\`\`tsx
<${componentName} variant="secondary">Secondary Button</${componentName}>
<${componentName} variant="outline">Outline Button</${componentName}>
\`\`\`

### Different Sizes

\`\`\`tsx
<${componentName} size="sm">Small</${componentName}>
<${componentName} size="lg">Large</${componentName}>
\`\`\`

## Accessibility

This component follows accessibility best practices:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Testing

The component includes comprehensive unit tests covering:
- Rendering behavior
- User interactions
- Accessibility features
- Edge cases
`;

    const filePath = path.join(componentDir, `${componentName}.md`);
    fs.writeFileSync(filePath, docsTemplate);
  }

  generateIndexFile(componentName, componentDir) {
    const indexTemplate = `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
export type * from './types';
`;

    const filePath = path.join(componentDir, "index.ts");
    fs.writeFileSync(filePath, indexTemplate);
  }

  // Utility methods
  toCamelCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

  getHTMLElement(componentType) {
    const elementMap = {
      ui: "button",
      layout: "div",
      form: "div",
      data: "div",
      feedback: "div",
      navigation: "nav",
    };
    return elementMap[componentType] || "div";
  }

  addStyledFeatures(template, componentName) {
    // Add styled-components features
    return template.replace(
      "import styles from './{{componentName}}.module.css';",
      `import styled from 'styled-components';
import styles from './{{componentName}}.module.css';`
    );
  }

  addResponsiveFeatures(template, componentName) {
    // Add responsive features to template
    return template;
  }

  addAccessibilityFeatures(template, componentName) {
    // Add accessibility features
    return template.replace(
      "<{{htmlElement}}",
      '<{{htmlElement}}\n        role="{this.getAriaRole(componentType)}"\n        aria-label={props["aria-label"]}'
    );
  }

  getAriaRole(componentType) {
    const roleMap = {
      ui: "button",
      layout: undefined,
      form: undefined,
      data: undefined,
      feedback: "alert",
      navigation: "navigation",
    };
    return roleMap[componentType];
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(
      "Usage: node scaffold-component.js <componentName> [componentType] [features...]"
    );
    console.log(
      "Example: node scaffold-component.js MyButton ui typescript responsive"
    );
    process.exit(1);
  }

  const [componentName, componentType = "ui", ...features] = args;

  try {
    const scaffolder = new ReactComponentScaffolder();
    scaffolder.generateComponent(componentName, componentType, features);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

module.exports = ReactComponentScaffolder;
