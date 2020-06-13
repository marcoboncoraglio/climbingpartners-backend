import app from './index';

app.listen(process.env.PORT || 4000, () => {
    // tslint:disable-next-line: no-console
    console.log(
        `Climbing partners is running: http://localhost:${process.env.PORT || 3000}`,
    );
});
