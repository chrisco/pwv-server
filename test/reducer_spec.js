import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {

    it('has an initial state', () => {
        const action = {type: 'SET_ENTRIES', entries: ['Donnie Darko']};
        const nextSate = reducer(undefined, action);

        expect(nextSate).to.equal(fromJS({
            entries: ['Donnie Darko']
        }));
    });

    it('handles SET_ENTRIES', () => {
        const initialState = Map();
        const action = {type: 'SET_ENTRIES', entries: ['Donnie Darko']};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            entries: ['Donnie Darko']
        }));
    });

    it('handles NEXT', () => {
        const initialState = fromJS({
            entries: ['Donnie Darko', 'Point Break']
        });
        const action = {type: 'NEXT'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Donnie Darko', 'Point Break']
            },
            entries: []
        }));
    });

    it('handles VOTE', () => {
        const initialState = fromJS({
            vote: {
                pair: ['Donnie Darko', 'Point Break']
            },
            entries: []
        });
        const action = {type: 'VOTE', entry: 'Donnie Darko'};
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Donnie Darko', 'Point Break'],
                tally: {'Donnie Darko': 1}
            },
            entries: []
        }));
    });

    it('can be used with reduce', () => {
        const actions = [
            {type: 'SET_ENTRIES', entries: ['Donnie Darko', 'Point Break']},
            {type: 'NEXT'},
            {type: 'VOTE', entry: 'Donnie Darko'},
            {type: 'VOTE', entry: 'Point Break'},
            {type: 'VOTE', entry: 'Donnie Darko'},
            {type: 'NEXT'}
        ];
        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS({
            winner: 'Donnie Darko'
        }));
    });
});
