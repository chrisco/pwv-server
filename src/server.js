import Server from 'socket.io';

export default function startServer(store) {
    const io = new Server().attach(55555);

    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    io.on('connect', (socket) => {
        socket.emit('state', store.getState().toJS());
        socket.on('action', store.dispatch.bind(store));
    });
}
