import { render,screen } from '@testing-library/react';
import Home from '../src/app/page';
import { describe, expect, test } from '@jest/globals'
import { FocusProvider } from '../src/app/components/FocusContext';

describe("FocusContext tests", () => {
    test("FocusContext loads with default state", () => {
        const foPro = render(<FocusProvider>
            <Home />
        </FocusProvider>);

    });
});