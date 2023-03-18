import { Dropdown, makeStyles, Option, shorthands, useId, DropdownProps, OptionGroup } from '@fluentui/react-components'
import * as React from 'react'

const useStyles = makeStyles({
    root: {
        // Stack the label above the field with a gap
        display: 'grid',
        gridTemplateRows: 'repeat(1fr)',
        justifyItems: 'start',
        ...shorthands.gap('2px'),
        maxWidth: '400px',
    },
})

export const Multiselect = (props: Partial<DropdownProps>) => {
    const comboId = useId('combo-multi')
    // const options = ['Cat', 'Dog', 'Ferret', 'Fish', 'Hamster', 'Snake']
    const land = ['Cat', 'Dog', 'Ferret', 'Hamster']
    const water = ['Fish', 'Jellyfish', 'Octopus', 'Seal']

    const styles = useStyles()
    return (
        <div className={styles.root}>
            <label id={comboId}>Best pet</label>
            <Dropdown aria-labelledby={comboId} multiselect={true} placeholder='Select an animal' {...props}>
                <OptionGroup label='Land'>
                    {land.map((option) => (
                        <Option key={option} disabled={option === 'Ferret'}>
                            {option}
                        </Option>
                    ))}
                </OptionGroup>
                <OptionGroup label='Sea'>
                    {water.map((option) => (
                        <Option key={option}>{option}</Option>
                    ))}
                </OptionGroup>
                {/* {options.map((option) => (
                    <Option key={option} disabled={option === 'Ferret'}>
                        {option}
                    </Option>
                ))} */}
            </Dropdown>
        </div>
    )
}
