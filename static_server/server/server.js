const Koa = require('koa');
const serve = require('koa-static');
const send = require('koa-send');
const path = require('path');
const { server_settings: { port, paths } } = require('./config');

const app = new Koa();

// Error handling middleware
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('Error occurred:', err);
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message || 'Internal Server Error',
            details: err.details || 'An error occurred while processing your request.',
        };
        app.emit('error', err, ctx);
    }
});

// Serve static files from build directory
app.use(serve(paths.build_dir));

// Redirect all routes to index.html for React Router
app.use(async (ctx) => {
    if (ctx.path.startsWith('/static/')) {
        return; // Static files, let koa-static handle them
    }

    if (ctx.path === '/') {
        await send(ctx, 'index.html', { root: paths.build_dir });
    } else {
        await send(ctx, 'index.html', { root: paths.build_dir });
    }
});

app.on('error', (err, ctx) => {
    console.error('Server crashed with error: \n', err);
});

const selected_port = process.argv[2] || port;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${selected_port}`);
});