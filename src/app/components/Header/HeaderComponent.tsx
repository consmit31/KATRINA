"use client";

import React from 'react'
import Image from 'next/image'
import { store } from "@redux/store";

import { Provider } from "react-redux";
import ShortcutsButton from './ShortcutsButton'
import ToolsShortcut from './ToolsButton'
import ThemeToggle from './ThemeToggle'
import AutomationButton from './AutomationButton';

const HeaderComponent = () => {
    return (
        <Provider store={store}>
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
                <div className="flex h-16 items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-700 to-blue-500 flex items-center justify-center">
                                <Image src="/favicon.ico" alt="KATRINA Logo" width={32} height={32} />
                            </div>
                            <div>
                                <span className='flex items-center gap-1'>
                                    <h1 className="text-xl font-bold">KATRINA</h1>
                                    <h1 
                                        className="text-lg font-semibold bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-transparent" 
                                        title="12/20/25 3:43 PM EST"
                                    >
                                        1.2.0
                                    </h1>
                                </span>
                                
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    Knowledge-base Assistant for Ticket Resolution & Incident Navigation Automation
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center space-x-3">
                        <ThemeToggle />
                        <div className="h-6 w-px bg-border"></div>
                        <ToolsShortcut />
                        <div className="h-6 w-px bg-border"></div>
                        <ShortcutsButton />
                        <div className="h-6 w-px bg-border"></div>
                        <AutomationButton />
                        </nav>
                </div>
            </header>
        </Provider>
    )
}

export default HeaderComponent