import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchCreateChannelMessage,
  fetchEditChannelMessage,
} from "../../../store/channelMessage";
import "./index.css";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ChannelMessageInputContainer = ({ cmId, edit, setEdit, cm }) => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (cm) {
      const contentFromRaw = convertFromRaw(JSON.parse(cm.content));
      const contentBlock = EditorState.createWithContent(contentFromRaw);

      setEditorState(contentBlock)
    }

    // if (setEdit) return () => setEdit(false);
  }, [cm]);

  useEffect(() => {
    if (!editorState) return;

    setContent(editorState.getCurrentContent().getPlainText())
  }, [editorState])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const contentRaw = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    return dispatch(
      edit
        ? fetchEditChannelMessage(cmId, { content: contentRaw })
        : fetchCreateChannelMessage(channelId, { content: contentRaw })
    )
      .then(() => {
        if (setEdit) setEdit(false);
      })
      .then(() => setContent(""))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <div className="cm-input-container">
      <div className="cm-input-block">
        <form onSubmit={handleSubmit} className="cm-form" onKeyUp={handleEnter}>
          {/* <div className="cm-input-box">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="cm-input"
            />
          </div> */}

          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "list"],
              inline: {
                inDropdown: false,
                className: undefined,
                options: ["bold", "italic", "strikethrough"],
              },
              list: {
                inDropdown: false,
                className: undefined,
                options: ["unordered", "ordered"],
                // unordered: { icon: unordered, className: undefined },
                // ordered: { icon: ordered, className: undefined },
              },
            }}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />

          <div className="cm-input-bottom">
            <div className="cm-input-botton-left"></div>
            <div className="cm-submit-box">
              {edit && (
                <button className={`cm-cancel-button`} onClick={handleCancel}>
                  Cancel
                </button>
              )}
              {edit ? (
                <button
                  type="submit"
                  className={`cm-submit-button cm-submit-button-highlight-true`}
                >
                  Send
                </button>
              ) : (
                <button
                  type="submit"
                  className={`cm-submit-button cm-submit-button-highlight-${
                    content !== ""
                  }`}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelMessageInputContainer;
