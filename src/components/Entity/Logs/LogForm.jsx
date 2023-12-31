import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Action from "../../UI/Actions.jsx";
import "./LogForm.scss";
import API from "../../api/API.jsx";

const initialLog = {
  LogID: "",
  LogName: "",
  LogGroupID: "",
  LogSubmissiondate: new Date(),
  LogGroupName: "",
};

function LogForm({ onCancel, onSuccess, groupID }) {
  // Initialisation ------------------------------
  const conformance = {
    html2js: {
      LogID: (value) => (value === "" ? null : value),
      LogName: (value) => (value === "" ? " " : value),
      LogGroupID: (value) => (value === "" ? null : value),
      LogSubmissiondate: (value) => new Date(value),
      LogGroupName: (value) => (value === "" ? " " : value),
    },

    js2html: {
      LogID: (value) => (value === null ? 0 : value),
      LogName: (value) => (value === "" ? " " : value),
      LogGroupID: (value) => (value === null ? 0 : value),
      LogSubmissiondate: (value) => value.toISOString().slice(0, 10),
      LogGroupName: (value) => (value === "" ? " " : value),
    },
  };

  const apiURL = "http://softwarehub.uk/unibase/api";
  const LogEndpoint = `${apiURL}/logs/1`;

  // State ---------------------------------------
  const [log, setLog] = useState({ ...initialLog, LogGroupID: groupID });

  const apiGet = async (LogEndpoint, setState) => {
    const response = await fetch(LogEndpoint);
    const result = await response.json();
    setState(result);
  };

  // const apiPost = async (LogEndpoint, record) => {
  //   const request = {
  //     method: "POST",
  //     body: JSON.stringify(record),
  //     headers: { "content-type": "application/json" },
  //   };

  //   //Call the fetch
  //   const response = await fetch(LogEndpoint, request);
  //   const result = await response.json();
  //   return response.status >= 200 && response.status < 300
  //     ? { isSuccess: true }
  //     : { isSuccess: false, message: result.message };
  // };

  useEffect(() => {
    if (groupID) {
      apiGet(LogEndpoint);
    }
  }, [LogEndpoint]);

  // Handlers ------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLog({ ...log, [name]: value });
  };
  const handleSubmit = async () => {
    console.log(`log=[${JSON.stringify(log)}]`);

    const result = await apiPost(LogEndpoint, log);
    result.isSuccess
      ? console.log(`Insert successful`)
      : console.log(`Insert NOT successful: ${result.message}`);
  };

  // View ----------------------------------------
  return (
    <div className="LogForm">
      <div className="FormTray">
        <label className="formLabel">
          Log Name:
          <input
            type="text"
            name="LogName"
            value={conformance.js2html["LogName"](log.LogName)}
            onChange={handleChange}
          />
        </label>

        <label className="formLabel">
          <input
            type="hidden"
            name="LogGroupID"
            value={conformance.js2html["LogGroupID"](log.LogGroupID)}
            onChange={handleChange}
          />
        </label>
        <label className="formLabel">
          Log Submission Date:
          <input
            type="text"
            name="LogSubmissiondate"
            value={conformance.js2html["LogSubmissiondate"](
              log.LogSubmissiondate
            )}
            onChange={handleChange}
          />
        </label>
      </div>

      <Action.Tray>
        <Action.Submit showText onClick={handleSubmit} />
        <Action.Cancel showText buttonText="Cancel Form" onClick={onCancel} />
      </Action.Tray>
    </div>
  );
}

LogForm.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  groupID: PropTypes.number,
};

export default LogForm;
