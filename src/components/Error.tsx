import EmptyScreen from "./EmptyScreen/emptyScreen";

export default () => {
	return (
		<EmptyScreen>
			<p>Brok dokumentów do wyświetlenia</p>
			<a className="btn btn-alt not-italic" href={document.location.href}>
				Spróbuj ponownie
			</a>
		</EmptyScreen>
	);
};
