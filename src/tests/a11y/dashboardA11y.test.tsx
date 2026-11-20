import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { Header } from '@/components/Header';
import { CorsiRosenthalCard } from '@/components/CorsiRosenthalCard';
import { ImpactSimulator } from '@/components/ImpactSimulator';
import { AskQClear } from '@/components/AskQClear';
import { DEMO_PRESETS } from '@/constants/presets';

expect.extend(toHaveNoViolations);

describe('WCAG 2.1 AA Accessibility Checks with Axe', () => {
  it('Header component should have zero accessibility violations', async () => {
    const { container } = render(
      <PreferencesProvider>
        <Header />
      </PreferencesProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AskQClear component should have zero accessibility violations', async () => {
    const { container } = render(
      <PreferencesProvider>
        <AskQClear aqiData={null} household={DEMO_PRESETS[0]} />
      </PreferencesProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('CorsiRosenthalCard should have zero accessibility violations', async () => {
    const { container } = render(
      <PreferencesProvider>
        <CorsiRosenthalCard />
      </PreferencesProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ImpactSimulator should have zero accessibility violations', async () => {
    const { container } = render(
      <PreferencesProvider>
        <ImpactSimulator ambientPm25={150} />
      </PreferencesProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
