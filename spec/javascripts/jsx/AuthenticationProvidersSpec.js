/*
 * Copyright (C) 2015 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import AuthenticationProviders from 'authentication_providers'

QUnit.module('AuthenticationProviders', () => {
  QUnit.module('.changedAuthType()', hooks => {
    let $container
    let clock

    hooks.beforeEach(() => {
      $container = document.createElement('div')
      document.body.appendChild($container)
      $container.innerHTML = `
        <form class="auth-form-container--new" id='google_form''>
          <span>Google Auth</span>
          <input id="google-auth-input" />
        </form>
        <form class="auth-form-container--new" id='facebook_form''>
          <span>Facebook Auth</span>
          <input id="facebook-auth-input" />
        </form>
      `

      clock = sinon.useFakeTimers()
    })

    hooks.afterEach(() => {
      clock.tick(100)
      clock.restore()
      $container.remove()
    })

    function showAllForms() {
      document.querySelectorAll('form').forEach($form => {
        $form.style.display = '' // eslint-disable-line no-param-reassign
      })
    }

    test('hides the "no authentication providers" message when present', () => {
      $container.innerHTML = '<div id="no_auth">No Authentication Providers</div>'
      AuthenticationProviders.changedAuthType('ldap')
      const noAuthDiv = document.getElementById('no_auth')
      equal(noAuthDiv.style.display, 'none')
    })

    test('hides all new auth forms', () => {
      showAllForms()
      AuthenticationProviders.changedAuthType('unrelated')
      document.querySelectorAll('form').forEach($form => {
        equal($form.style.display, 'none')
      })
    })

    test('shows the form for the matching auth type', () => {
      AuthenticationProviders.changedAuthType('facebook')
      const $form = document.getElementById('facebook_form')
      strictEqual($form.style.display, '')
    })

    test('does not show unrelated forms', () => {
      AuthenticationProviders.changedAuthType('facebook')
      const $form = document.getElementById('google_form')
      equal($form.style.display, 'none')
    })

    test('sets focus on the first focusable element of the visible form', () => {
      AuthenticationProviders.changedAuthType('google')
      clock.tick(100)
      const $input = document.getElementById('google-auth-input')
      strictEqual(document.activeElement, $input)
    })
  })
})
