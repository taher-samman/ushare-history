import { getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { formatPrice } from "../../firebase";
import OutComes from "./outComes";

function Score(props) {
    const score = props.score;
    const outComes = props.outComes;
    const [render, setRender] = useState(false);
    useEffect(() => {
        const filterOutComes = async _ => {
            for (let index = 0; index < outComes.length; index++) {
                const outCome = outComes[index]
                await new Promise(resolve => getDoc(outCome.score)
                    .then((s) => {
                        console.log(`outCome:${outCome.price} is for ${s.id}`)
                        if (s.id !== score.id) {
                            delete outComes[index];
                        }
                    })
                    .finally(resolve)
                )
            }
            setRender(true);
        }
        filterOutComes();
    }, [outComes,score]);
    if (render) {
        return (
            <>
                <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-${score.id}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#a-${score.id}`} aria-expanded="false" aria-controls={`a-${score.id}`}>
                            {`${formatPrice(score.capital)}`}
                        </button>
                    </h2>
                    <div id={`a-${score.id}`} className="accordion-collapse  collapse" aria-labelledby={`heading-${score.id}`} data-bs-parent="#accordionScores">
                        <div className="accordion-body">
                            {outComes.length > 0 && <OutComes openModal={() => { console.log('open') }} outcomes={outComes} />}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Score;