import * as React from "react";
import { ListItem } from "@rneui/themed";

export default function Selector({ items, TitleComponent, ListItemChild, keyPrefix, onPress }) {
	const [isExpandable, setExpansion] = React.useState(false);

	return (
		<ListItem.Accordion
			style={{ width: '100%' }}
			content={<TitleComponent />}
			isExpanded={isExpandable}
			onPress={() => {
				setExpansion(!isExpandable);
			}}
		>
			{items.map((item, itemIndex) => (
				<ListItem
					key={`${keyPrefix}-${item}-${itemIndex}`}
					onPress={() => {
						onPress(item)
						setExpansion(false)
					}}
					bottomDivider
				>
					<ListItemChild data={item} />
				</ListItem>
			))}
		</ListItem.Accordion>
	)
}