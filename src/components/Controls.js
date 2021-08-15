import { STICKER_SIZE } from '../constants';

const renderControl = (label, step, min, onChange, props) => (
  <label>
    {label}
    <input type="number" step={step} min={min} onChange={onChange} {...props} />
  </label>
);

export const Controls = ({ addSticker, updateSettings }) => (
  <div className="Controls">
    {renderControl('Width', 10, STICKER_SIZE.minWidth, updateSettings('width'))}
    {renderControl('Height', 10, STICKER_SIZE.minHeight, updateSettings('height'))}
    {renderControl('X position', 10, 0, updateSettings('x'))}
    {renderControl('Y position', 10, 0, updateSettings('y'))}
    <button onClick={addSticker}>Create</button>
  </div>
);
