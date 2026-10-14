//-- copyright
// OpenProject is an open source project management software.
// Copyright (C) the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nService } from 'core-app/core/i18n/i18n.service';
import { MainMenuToggleService } from 'core-app/core/main-menu/main-menu-toggle.service';
import { MainMenuResizerComponent } from './main-menu-resizer.component';

describe('MainMenuResizerComponent', () => {
  let menu:HTMLDivElement;
  let component:MainMenuResizerComponent;
  const resizeTo = vi.fn();
  const toggle = vi.fn();

  beforeEach(() => {
    menu = document.createElement('div');
    menu.id = 'main-menu';
    menu.style.width = '240px';
    document.body.appendChild(menu);
    resizeTo.mockClear();
    toggle.mockClear();

    TestBed.configureTestingModule({
      declarations: [MainMenuResizerComponent],
      providers: [
        { provide: I18nService, useValue: { t: (key:string) => key } },
        { provide: MainMenuToggleService, useValue: { isOpen: signal(true), resizeTo, toggle } },
      ],
    }).overrideComponent(MainMenuResizerComponent, { set: { template: '' } });

    component = TestBed.createComponent(MainMenuResizerComponent).componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    menu.remove();
  });

  it.each([
    { direction: 'ltr', delta: 40, width: 280 },
    { direction: 'rtl', delta: -40, width: 280 },
    { direction: 'rtl', delta: 40, width: 200 },
  ])('resizes a $direction menu dragged by $delta pixels', ({ direction, delta, width }) => {
    menu.style.direction = direction;
    component.resizeStart();
    component.resizeMove({
      origin: new MouseEvent('mousemove'),
      absolute: { x: delta, y: 0 },
      relative: { x: delta, y: 0 },
    });

    expect(resizeTo).toHaveBeenCalledWith(width);
  });

  it('does not collapse the menu on the click following a drag', () => {
    component.resizeStart();
    component.resizeMove({
      origin: new MouseEvent('mousemove'),
      absolute: { x: 40, y: 0 },
      relative: { x: 40, y: 0 },
    });
    component.resizeEnd();
    component.toggle(new MouseEvent('click', { detail: 1 }));

    expect(toggle).not.toHaveBeenCalled();
  });

  it('allows keyboard activation after a drag', () => {
    component.resizeStart();
    component.resizeMove({
      origin: new MouseEvent('mousemove'),
      absolute: { x: 40, y: 0 },
      relative: { x: 40, y: 0 },
    });
    component.resizeEnd();
    component.toggle(new MouseEvent('click', { detail: 0 }));

    expect(toggle).toHaveBeenCalledOnce();
  });

  it('allows a pointer click without dragging', () => {
    component.resizeStart();
    component.resizeEnd();
    component.toggle(new MouseEvent('click', { detail: 1 }));

    expect(toggle).toHaveBeenCalledOnce();
  });
});
