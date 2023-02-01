import Score from "./score";

function Scores(props) {
    const scores = props.scores;
    const outComes = props.outcomes.filter(out => out.score !== null);
    return (
        <>
            <div className="accordion pt-5" id="accordionScores">
                {scores.map((s) =>
                    <Score
                        key={s.id}
                        score={s}
                        outComes={outComes}
                    />
                )}
            </div>
        </>
    );
}
export default Scores;