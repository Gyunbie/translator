import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Loader } from "../assets/Infinity-1s-200px.svg";
import { ReactComponent as Rec } from "../assets/recording-video-icon.svg";
import { ReactComponent as Stop } from "../assets/stop-blocked-icon.svg";
import { addToEn, addToTr } from "../store/translateSlice";

function Index() {
  // Speech Recognition variables
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;

  const dispatch = useDispatch();
  const translates = useSelector((state) => state);

  const [toTranslate, setToTranslate] = useState("");
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // Do not run if there is nothing to translate
    if (!toTranslate) {
      setTranslating(false);
      setTranslated("");
      return;
    }

    setTranslating(true);

    // Start translation after 1s user types something
    // Accomplishes translation without clicking anything
    const translateTimeout = setTimeout(async function () {
      try {
        const res = await fetch(
          "https://translate.argosopentech.com/translate",
          {
            method: "POST",
            body: JSON.stringify({
              q: toTranslate,
              source: "en",
              target: "tr",
            }),
            headers: { "Content-Type": "application/json" },
          },
          1000
        );

        const translated = (await res.json())?.translatedText;

        setTranslated(translated);

        dispatch(addToEn(toTranslate));
        dispatch(addToTr(translated));
      } catch (e) {
        console.log(e);
      } finally {
        setTranslating(false);
      }
    }, 1000);

    return () => clearTimeout(translateTimeout);
  }, [toTranslate, dispatch]);

  async function handleToTranslateChange(e) {
    setToTranslate(e.target.value);
  }

  async function recorder() {
    // If not recording, start record process
    if (!recording) {
      // Request permission
      await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      recognition.onresult = function (e) {
        setRecording(false);

        const transcript = e.results?.[0]?.[0]?.transcript;
        setToTranslate(transcript);

        recognition.abort();
      };

      recognition.onspeechend = function () {
        recognition.stop();
      };

      recognition.start();
      setRecording(true);
    } else {
      recognition.stop();
    }
  }

  return (
    <div className="container container--index">
      <h1 className="header header--big">Translate English to Turkish</h1>

      <div className="translate-text">
        <div className="translate-input-wrapper">
          <textarea
            rows={5}
            value={toTranslate}
            onChange={handleToTranslateChange}
            placeholder="Enter text to translate"
            className="translate-input"
          ></textarea>

          <button onClick={recorder} className="button button-record">
            {recording ? (
              <Stop className="icon icon-record" />
            ) : (
              <Rec className="icon icon-record" />
            )}
            <p>{recording ? "Stop Recording" : "Record Voice"}</p>
          </button>
        </div>

        <div className="translate-output">
          <p>{translated}</p>
          {translating && <Loader className="icon-loader" />}
        </div>
      </div>

      <div className="history-wrapper">
        <h2 className="heading heading-history-section">History</h2>

        <div className="history">
          <h3 className="heading-history">EN</h3>

          <div className="translation-history">
            {translates?.en?.length > 0 ? (
              translates?.en?.map((translate) => <p>{translate}</p>)
            ) : (
              <p>No translations yet</p>
            )}
          </div>
        </div>
        <div className="history">
          <h3 className="heading-history">TR</h3>

          <div className="translation-history">
            {translates?.tr?.map((translate) => (
              <p>{translate}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
