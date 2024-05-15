import { React } from "react";
import { Component } from "@wordpress/element";
import "./style.scss";
import WaTab from "./WaTab";

class WaTabs extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: Object.keys(props.children)[0] };
    this.onActiveTabChange = this.onActiveTabChange.bind(this);
  }

  onActiveTabChange(newActiveTab) {
    newActiveTab = newActiveTab.replace("_", " ");
    if (newActiveTab !== this.state.activeTab)
      this.setState({ activeTab: newActiveTab });
  }

  updateTab() {
    if (typeof this.props.selectedTab == "number") {
      const selectedTab = Number(this.props.selectedTab);
      const tabNames = Object.keys(this.props.children);
      if (
        selectedTab >= 0 &&
        Number(this.props.selectedTab) <= tabNames.length &&
        this.state.activeTab != tabNames[selectedTab]
      )
        this.setState({
          ...this.state,
          activeTab: tabNames[selectedTab],
        });
    }
    if (
      typeof this.props.selectedTab == "string" &&
      this.props.selectedTab in this.props.children &&
      this.props.selectedTab != this.state.activeTab
    ) {
      this.setState({
        ...this.state,
        activeTab: this.props.selectedTab,
      });
    }
  }

  componentDidMount() {
    this.updateTab();
  }
  componentDidUpdate() {
    this.updateTab();
  }

  render() {
    const { children, header, footer } = this.props;
    return (
      <div
        style={this.props.style ?? {}}
        class="wa-tabs cf-container cf-container-carbon_fields_container_wa_common_settings cf-container-theme-options cf-container--tabbed cf-container--tabbed-horizontal"
      >
        <div class="cf-container__tabs cf-container__tabs--tabbed-horizontal">
          <ul class="cf-container__tabs-list">
            {Object.keys(children).map((k) => (
              <WaTab
                title={k}
                active={k == this.state.activeTab}
                onClick={this.onActiveTabChange}
              />
            ))}
          </ul>
        </div>
        <div class="cf-container__fields">
          {Object.keys(children).map((k) => (
            <div
              style={{
                display: k == this.state.activeTab ? "block" : "none",
                position: "relative",
              }}
              class="cf-field__body"
            >
              {typeof children[k] === "function"
                ? children[k]({
                    onActiveTabChange: this.onActiveTabChange,
                  })
                : children[k]}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default WaTabs;
