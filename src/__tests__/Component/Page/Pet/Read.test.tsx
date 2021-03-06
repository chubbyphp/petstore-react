import React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import HttpError from '../../../../Model/Error/HttpError';
import NotFound from '../../../../Model/Error/NotFound';
import PetResponse from '../../../../Model/Pet/PetResponse';
import Read from '../../../../Component/Page/Pet/Read';
import Vaccination from '../../../../Model/Pet/Vaccination';

let mockReadPet = (id: string) => { };

jest.mock('../../../../ApiClient/Pet', () => {
    return {
        ReadPet: (id: string) => {
            return mockReadPet(id);
        }
    };
});

jest.mock('../../../../Component/Partial/HttpError', () => {
    return ({ httpError }: { httpError: HttpError; }) => {
        return (<div>httpError: {httpError.title}</div>);
    };
});

test('not found', async () => {
    mockReadPet = async (id: string) => {
        return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        },
        isExact: true,
        path: '/pet/:id',
        url: ''
    };

    const { container } = render(
        <Router history={history}>
            <Read history={history} location={history.location} match={match} />
        </Router>
    );

    await screen.findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-read">
                <div>httpError: title</div>
                <h1>Read Pet</h1>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('minimal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        name: 'Brownie'
    });

    mockReadPet = async (id: string) => {
        return new Promise<PetResponse>((resolve) => resolve(pet));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        },
        isExact: true,
        path: '/pet/:id',
        url: ''
    };

    const { container } = render(
        <Router history={history}>
            <Read history={history} location={history.location} match={match} />
        </Router>
    );

    await screen.findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-read">
                <h1>Read Pet</h1>
                <div>
                    <dl>
                        <dt>Id</dt>
                        <dd>4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
                        <dt>CreatedAt</dt>
                        <dd>15.08.2005 - 17:52:01</dd>
                        <dt>UpdatedAt</dt>
                        <dd></dd>
                        <dt>Name</dt>
                        <dd>Brownie</dd>
                        <dt>Tag</dt>
                        <dd></dd>
                        <dt>Vaccinations</dt>
                        <dd></dd>
                    </dl>
                    <a class="btn-gray" href="/pet">List</a>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});

test('maximal', async () => {
    const pet = new PetResponse({
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        updatedAt: '2005-08-15T15:55:01+00:00',
        name: 'Brownie',
        tag: '0001-000',
        vaccinations: [
            new Vaccination({ name: 'Rabies' })
        ]
    });

    mockReadPet = async (id: string) => {
        return new Promise<PetResponse>((resolve) => resolve(pet));
    };

    const history = createMemoryHistory();

    const match = {
        params: {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9'
        },
        isExact: true,
        path: '/pet/:id',
        url: ''
    };

    const { container } = render(
        <Router history={history}>
            <Read history={history} location={history.location} match={match} />
        </Router>
    );
    await screen.findByTestId('page-pet-read');

    expect(container.outerHTML).toBe(`
        <div>
            <div data-testid="page-pet-read">
                <h1>Read Pet</h1>
                <div>
                    <dl>
                        <dt>Id</dt>
                        <dd>4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
                        <dt>CreatedAt</dt>
                        <dd>15.08.2005 - 17:52:01</dd>
                        <dt>UpdatedAt</dt>
                        <dd>15.08.2005 - 17:55:01</dd>
                        <dt>Name</dt>
                        <dd>Brownie</dd>
                        <dt>Tag</dt>
                        <dd>0001-000</dd>
                        <dt>Vaccinations</dt>
                        <dd>
                            <ul>
                                <li>Rabies</li>
                            </ul>
                        </dd>
                    </dl>
                    <a class="btn-gray" href="/pet">List</a>
                </div>
            </div>
        </div>
    `.replace(/\n/g, '').replace(/ {2,}/g, ''));
});
