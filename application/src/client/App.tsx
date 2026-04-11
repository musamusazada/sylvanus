import { useMemo, useState } from "react";
import { SlotEngine, type IPlayResponse } from "../engine";
import { sampleConfig } from "../config/sample";

export const App = () => {

  const engine = useMemo(() => new SlotEngine(sampleConfig), []);

  const [playData, setPlayData] = useState<IPlayResponse | null>(null);

  const handleSpinClick = () => {
    const response = engine.play();
    setPlayData(response);
  };
  
  return (
    <div>
      <div>
        <p>Balance: {playData?.state.final.balance}</p>
        <p>Bet: {playData?.state.final.bet}</p>
      </div>

      <button 
        onClick={handleSpinClick}
      >
        Play
      </button>

      <div>
        <h3>Engine Output (PlayResponse):</h3>
        {playData && (
          <div>
            {JSON.stringify(playData, null, 2)}
          </div>
        )}
      </div>
    </div>
  )
}