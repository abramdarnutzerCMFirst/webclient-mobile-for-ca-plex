wcli.util.regModel("/(!NameID)", /(!This:!jsonCols));
window["/(!NameID)_store"] = new Ext.data.Store(
	wcli.util.gridDataStore("/(!NameID)",
		/(!This:!jsonCols),
		/(!This:!jsonRows),
		grouped, /(!NameID)_cols)
);
window["/(!NameID)_dataType"] = /(!NameID)_cols.slice();
window["/(!NameID)_store"].colModes = wcli.util.gridModeStore("/(!NameID)",
		/(!This:!jsonCols),
		/(!This:!jsonRows));
