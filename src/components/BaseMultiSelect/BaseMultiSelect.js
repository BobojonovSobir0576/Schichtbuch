
import Multiselect from 'multiselect-react-dropdown';
import "./BaseMultiSelect.css"

const BaseMultiSelect = ({ single, select, placeholder, value, options }) => {
    return (
        <>
            <Multiselect
                className='select_cus'
                style={{ borderRadius: '50px' }}
                singleSelect={single}
                options={options}
                selectedValues={value}
                onSelect={select}
                displayValue="name"
                placeholder={placeholder}
                closeIcon='cancel'
            />
        </>
    )
}
export default BaseMultiSelect