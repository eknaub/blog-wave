import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { RouteNames } from '../shared/interfaces/routes';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: AuthService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  };

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should check if user is not logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    createComponent();
    expect(component.isLoggedIn()).toBeFalse();
  });

  it('should call logout on authService when logout is called', () => {
    spyOn(authService, 'logout');
    createComponent();
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should show correct navigation routes when logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();

    const navLinks = fixture.nativeElement.querySelectorAll('a');

    expect(navLinks.length).toBe(3);
    expect(navLinks[0].getAttribute('name')).toBe('homeLogoLink');
    expect(navLinks[1].getAttribute('name')).toBe('homeLink');
    expect(navLinks[2].getAttribute('name')).toBe('dashboardLink');
  });

  it('should show correct navigation routes when not logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    createComponent();

    const navLinks = fixture.nativeElement.querySelectorAll('a');

    expect(navLinks.length).toBe(2);
    expect(navLinks[0].getAttribute('name')).toBe('homeLogoLink');
    expect(navLinks[1].getAttribute('name')).toBe('homeLink');
  });

  it('should show correct menu items when logged in', async () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();

    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();

    const menuItems = await menu.getItems();
    expect(menuItems.length).toBe(3);

    const itemTexts = await Promise.all(
      menuItems.map((item) => item.getText())
    );
    expect(itemTexts).toContain('personProfile');
    expect(itemTexts).toContain('settingsSettings');
    expect(itemTexts).toContain('logoutLogout');
  });

  it('should show correct menu items when not logged in', async () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    createComponent();

    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();

    const menuItems = await menu.getItems();
    expect(menuItems.length).toBe(1);

    const itemText = await menuItems[0].getText();
    expect(itemText).toBe('settingsSettings');
  });

  it('should navigation routes have correct links', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();

    const navLinks = fixture.nativeElement.querySelectorAll('a');

    expect(navLinks.length).toBe(3);
    expect(navLinks[0].getAttribute('href')).toBe(`/${RouteNames.HOME}`);
    expect(navLinks[1].getAttribute('href')).toBe(`/${RouteNames.HOME}`);
    expect(navLinks[2].getAttribute('href')).toBe(`/${RouteNames.DASHBOARD}`);
  });
});
