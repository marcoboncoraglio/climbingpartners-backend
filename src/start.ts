import app from './index';

export const PORT: number = 4000;

app.listen(process.env.PORT || PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(
        `Climbing partners is running: http://localhost:${process.env.PORT || PORT}`,
    );
});
