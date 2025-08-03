import { FRAMEWORKS, getVariantByName } from '../src/config/frameworks';
import { TAILWINDFRAMEWORKS, getTailwindTemplateDir } from '../src/config/tailwindframeworks';

describe('Frameworks Configuration', () => {
  describe('FRAMEWORKS', () => {
    it('should have valid framework structure', () => {
      expect(FRAMEWORKS).toBeDefined();
      expect(Array.isArray(FRAMEWORKS)).toBe(true);
      expect(FRAMEWORKS.length).toBeGreaterThan(0);

      FRAMEWORKS.forEach(framework => {
        expect(framework.name).toBeDefined();
        expect(framework.display).toBeDefined();
        expect(framework.color).toBeInstanceOf(Function);
        expect(Array.isArray(framework.variants)).toBe(true);
        
        framework.variants.forEach(variant => {
          expect(variant.name).toBeDefined();
          expect(variant.display).toBeDefined();
          expect(variant.color).toBeInstanceOf(Function);
          expect(variant.desc).toBeDefined();
        });
      });
    });

    it('should contain expected frameworks', () => {
      const frameworkNames = FRAMEWORKS.map(f => f.name);
      expect(frameworkNames).toContain('vanilla');
      expect(frameworkNames).toContain('react');
      expect(frameworkNames).toContain('vue');
      expect(frameworkNames).toContain('svelte');
    });
  });

  describe('getVariantByName', () => {
    it('should find existing variants', () => {
      const result = getVariantByName(FRAMEWORKS, 'vanilla-ts');
      expect(result).toBeDefined();
      expect(result?.variant.name).toBe('vanilla-ts');
      expect(result?.framework.name).toBe('vanilla');
    });

    it('should return null for non-existing variants', () => {
      const result = getVariantByName(FRAMEWORKS, 'non-existing-variant');
      expect(result).toBeNull();
    });

    it('should find React TypeScript variant', () => {
      const result = getVariantByName(FRAMEWORKS, 'react-ts');
      expect(result).toBeDefined();
      expect(result?.variant.name).toBe('react-ts');
      expect(result?.framework.name).toBe('react');
      expect(result?.variant.templateDir).toBe('template-react-ts');
    });
  });
});

describe('Tailwind Configuration', () => {
  describe('TAILWINDFRAMEWORKS', () => {
    it('should have valid structure', () => {
      expect(TAILWINDFRAMEWORKS).toBeDefined();
      expect(Array.isArray(TAILWINDFRAMEWORKS)).toBe(true);
      expect(TAILWINDFRAMEWORKS.length).toBeGreaterThan(0);

      TAILWINDFRAMEWORKS.forEach(framework => {
        expect(framework.name).toBeDefined();
        expect(framework.display).toBeDefined();
        expect(framework.color).toBeInstanceOf(Function);
        expect(Array.isArray(framework.variants)).toBe(true);

        framework.variants.forEach(variant => {
          expect(variant.name).toBeDefined();
          expect(variant.display).toBeDefined();
          expect(variant.color).toBeInstanceOf(Function);
          expect(variant.customCommand).toBeDefined();
          expect(variant.templateSuffix).toBeDefined();
          expect(variant.desc).toBeDefined();
        });
      });
    });

    it('should contain Tailwind variants', () => {
      const variants = TAILWINDFRAMEWORKS[0].variants.map(v => v.name);
      expect(variants).toContain('tailwind-v3');
      expect(variants).toContain('tailwind-v4');
    });
  });

  describe('getTailwindTemplateDir', () => {
    it('should generate correct Tailwind template paths', () => {
      const result1 = getTailwindTemplateDir('template-react-ts', 'tailwind-v3');
      expect(result1).toBe('tw-template-react-ts-v3');

      const result2 = getTailwindTemplateDir('template-vue-ts', 'tailwind-v4');
      expect(result2).toBe('tw-template-vue-ts-v4');
    });

    it('should return original path if no Tailwind variant', () => {
      const result = getTailwindTemplateDir('template-react-ts', '');
      expect(result).toBe('template-react-ts');
    });

    it('should return original path if invalid Tailwind variant', () => {
      const result = getTailwindTemplateDir('template-react-ts', 'invalid-variant');
      expect(result).toBe('template-react-ts');
    });
  });
});