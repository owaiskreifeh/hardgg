# Mobile Features for FitGirl Repacks

## Overview
This document describes the mobile-responsive features implemented for the FitGirl Repacks application.

## Features Implemented

### 1. Sticky Search Bar (Mobile)
- **Component**: `StickySearchBar`
- **Location**: Top of screen on mobile devices
- **Behavior**: 
  - Sticky positioning with backdrop blur
  - Hidden on desktop (lg: breakpoint and above)
  - Provides quick access to search functionality
  - Maintains search state across the app

### 2. Floating Action Button (Mobile)
- **Component**: `FloatingActionButton`
- **Location**: Bottom-right corner on mobile devices
- **Behavior**:
  - Fixed positioning with smooth animations
  - Opens mobile menu dialog when clicked
  - Hidden on desktop (lg: breakpoint and above)
  - Hover and active state animations
  - Uses Filter icon by default

### 3. Mobile Menu Dialog
- **Component**: `MobileMenu`
- **Behavior**:
  - Slide-in animation from left side
  - Full-height overlay with backdrop
  - Contains search bar and filter panel
  - Prevents body scroll when open
  - Closes on escape key or backdrop click
  - Responsive design with proper spacing

### 4. Responsive Layout
- **Desktop**: Sidebar with sticky positioning
- **Mobile**: Hidden sidebar, mobile menu access via FAB
- **Breakpoint**: lg (1024px) and above for desktop layout

## Technical Implementation

### State Management
- Added `mobileMenuOpen` to UI slice
- New actions: `setMobileMenuOpen`
- Updated selectors and hooks for mobile menu state

### Components Created
1. `MobileMenu.tsx` - Mobile menu dialog component
2. `FloatingActionButton.tsx` - Floating action button
3. `StickySearchBar.tsx` - Sticky search bar for mobile

### CSS Classes Used
- Gaming theme classes: `gaming-bg`, `gaming-card`, `gaming-border`, etc.
- Tailwind responsive classes: `lg:hidden`, `hidden lg:block`
- Animation classes: `transform`, `transition-transform`, `duration-300`

## Usage

### Opening Mobile Menu
1. On mobile devices, tap the floating action button (bottom-right)
2. Menu slides in from the left with search and filters
3. Use search bar or adjust filters as needed
4. Tap "Apply Filters" or backdrop to close

### Search on Mobile
1. Use the sticky search bar at the top of the screen
2. Or open mobile menu for advanced search options
3. Search updates in real-time with debouncing

### Responsive Behavior
- **Mobile (< 1024px)**: Sticky search + FAB + mobile menu
- **Desktop (≥ 1024px)**: Traditional sidebar layout

## App Title Update
- Updated app title to "FitGirl Repacks - Repacked Games"
- Updated metadata and OpenGraph tags
- Added "repacked" keyword for better SEO

## Accessibility Features
- Proper ARIA labels on interactive elements
- Keyboard navigation support (Escape key to close menu)
- Focus management for modal dialogs
- Screen reader friendly component structure

## Performance Considerations
- Debounced search input to reduce API calls
- Efficient state management with Redux Toolkit
- Optimized animations with CSS transforms
- Lazy loading of components where appropriate
