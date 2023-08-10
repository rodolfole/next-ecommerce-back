import { FC } from "react";
import CreatableSelect from "react-select/creatable";

type MultiTagProps = {
  id: string;
  options: any[];
  onChange: (value: any) => void;
  value?: any;
};

const MultiTag: FC<MultiTagProps> = ({ id, onChange, options, value }) => {
  return (
    <CreatableSelect
      className="multi-tag"
      id={id}
      instanceId={id}
      isMulti
      onChange={onChange}
      options={options}
      placeholder="Select"
      value={value}
    />
  );
};

export default MultiTag;
