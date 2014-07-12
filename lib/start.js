/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Start
 */
module.exports = function (amna, log) {
    return function (config) {

        /**
         * Set log path
         */
        amna.$LOG_PATH = process.cwd();
        if (typeof config.log === 'string' && config.log.length) {
            if (config.log[0] === '/') {
                amna.$LOG_PATH = config.log;
            }
            else {
                amna.$LOG_PATH += '/' + config.log;
            }
        }
        else {
            amna.$LOG_PATH += '/logs/amna.log';
        }

        /**
         * Connect to mongo
         */
        amna.mongo.connect(config.mongo, function () {
            log('database connected');
        });

        /**
         * Error handling
         */
        amna.$express.use(function (err, req, res, next) {
            err.status = err.status || 500;
            log.request(req, 'HTTP', err.status, err);
            res.json(err.status, amna.responses.error(err.message || err));
        });

        /**
         * No route matched
         */
        amna.$express.use(function (req, res, next) {
            log.request(req, 'HTTP', 404, 'Not Found');
            res.json(404, amna.responses.error('Not Found'));
        });

        /**
         * Start the express app
         */
        amna.$express.listen(config.port || 8080);
    };
};