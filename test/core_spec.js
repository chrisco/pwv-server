import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () => {

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('Donnie Darko', 'Point Break');
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Donnie Darko', 'Point Break')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Donnie Darko', 'Point Break'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Donnie Darko', 'Point Break')
            }));
        });
    });

    describe('next', () => {
        it('takes the next pair of entries up for vote', () => {
            const state = Map({
                entries: List.of('Donnie Darko', 'Point Break', '11:14')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break')
                }),
                entries: List.of('11:14')
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 4,
                        'Point Break': 2
                    })
                }),
                entries: List.of('The Outsiders', 'Ghost', 'Dirty Dancing')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('The Outsiders', 'Ghost')
                }),
                entries: List.of('Dirty Dancing', 'Donnie Darko')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 3,
                        'Point Break': 3
                    })
                }),
                entries: List.of('The Outsiders', 'Ghost', 'Dirty Dancing')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('The Outsiders', 'Ghost')
                }),
                entries: List.of('Dirty Dancing', 'Donnie Darko', 'Point Break')
            }));
        });

        it("picks the winner when there's one entry left", () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 4,
                        'Point Break': 2
                    })
                }),
                entries: List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Donnie Darko'
            }));
        });
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break')
                }),
                entries: List()
            });
            const nextState = vote(state, 'Donnie Darko');

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 1
                    })
                }),
                entries: List()
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 3,
                        'Point Break': 2
                    })
                }),
                entries: List()
            });
            const nextState = vote(state, 'Donnie Darko');

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Donnie Darko', 'Point Break'),
                    tally: Map({
                        'Donnie Darko': 4,
                        'Point Break': 2
                    })
                }),
                entries: List()
            }));
        });
    });
});
