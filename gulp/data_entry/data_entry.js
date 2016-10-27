var gulp = require('gulp');
var mongodbData = require('gulp-mongodb-data');

gulp.task('insert_per_acc', function() {
    gulp.src('./per_acc.json')
        .pipe(mongodbData({
            mongoUrl: 'mongodb://localhost/define',
            collectionName: 'per_acc'
        }))
});

gulp.task('insert_per_txn', function() {
    gulp.src('./per_txn.json')
        .pipe(mongodbData({
            mongoUrl: 'mongodb://localhost/define',
            collectionName: 'per_txn'
        }))
});


gulp.task('insert_per_budget', function() {
    gulp.src('./per_budget.json')
        .pipe(mongodbData({
            mongoUrl: 'mongodb://localhost/define',
            collectionName: 'per_budget'
        }))
});