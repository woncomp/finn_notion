import raptorPubsub from "raptor-pubsub";
import button from "../app-button/index.marko";
import checkbox from "../app-checkbox/index.marko";
import progressBar from "../app-progress-bar/index.marko";

const buttonSizes = ["small", "normal", "large"];
const buttonVariants = ["primary", "secondary"];

let currentButtonSize = 0;
let currentButtonVariant = 0;


async function fetch_post(api, obj) {
  let resp = await fetch(api, {
    method: "POST",
    body: JSON.stringify(obj || {}),
    headers: {
      "content-type": "application/json",
    },
  })
  console.log(resp);
  return await resp.json();
}

async function fetch_get(api) {
  const resp = await fetch(api);
  return await resp.json();
}

async function fetchSchema(initialSchema) {
  const db_data = await fetch_get('/db/create_page');

  const games = initialSchema.game.map(item => {
    return {
      checked: db_data.tags_game.includes(item.id),
      ...item
    };
  });

  return {
    game: games
  };
}

export default class {
  onInput(input) {
    const now = new Date().toString();

    this.state = {
      buttonSize: input.buttonSize || "small",
      buttonVariant: input.buttonVariant || "primary",
      overlayVisible: false,
      checked: input.checked || {
        foo: false,
        bar: true,
        baz: false
      },
      schema: null,
      dynamicTabs: [
        {
          timestamp: now
        },
        {
          timestamp: now
        }
      ]
    };
  }

  handleCheckboxToggle(event) {
    const { state } = this;
    const { checked, data: { name } } = event;

    // We treat complex objects stored in the state as immutable
    // since only a shallow compare is done to see if the state
    // has changed. Instead of modifying the "checked" object,
    // we create a new object with the updated state of what is
    // checked.
    this.state.checked = {
      ...state.checked,
      [name]: checked
    };
  }

  /**
   * This demonstrates how to provide a custom state transition handler to avoid
   * a full rerender.
   */
  update_overlayVisible(overlayVisible) {
    this.getComponent("overlay").setVisibility(overlayVisible);
  }

  handleShowOverlayButtonClick() {
    // this.setState('overlayVisible', true);
    this.getComponent("overlay").show();
  }

  handleOverlayHide() {
    // Synchronize the updated state of the o
    this.setState("overlayVisible", false);
  }

  handleOverlayShow() {
    this.setState("overlayVisible", true);
  }

  handleShowNotificationButtonClick() {
    raptorPubsub.emit("notification", {
      message: "This is a notification"
    });
  }

  handleOverlayOk() {
    raptorPubsub.emit("notification", {
      message: 'You clicked the "Done" button!'
    });
  }

  handleOverlayCancel() {
    raptorPubsub.emit("notification", {
      message: 'You clicked the "Cancel" button!'
    });
  }

  handleRenderButtonClick() {
    button
      .renderSync({
        label: "Hello World"
      })
      .appendTo(this.getEl("renderTarget"));
  }

  handleRenderCheckboxButtonClick() {
    checkbox
      .renderSync({
        label: "Hello World",
        checked: true
      })
      .appendTo(this.getEl("renderTarget"));
  }

  handleRenderProgressBarButtonClick() {
    progressBar
      .renderSync({
        steps: [
          {
            label: "Step 1"
          },
          {
            label: "Step 2"
          },
          {
            label: "Step 3",
            active: true
          },
          {
            label: "Step 4"
          }
        ]
      })
      .appendTo(this.getEl("renderTarget"));
  }

  handleChangeButtonSizeClick() {
    const nextButtonSize = buttonSizes[++currentButtonSize % buttonSizes.length];
    this.state.buttonSize = nextButtonSize;
  }

  handleChangeButtonVariantClick() {
    const nextButtonVariant =
      buttonVariants[++currentButtonVariant % buttonVariants.length];
    this.state.buttonVariant = nextButtonVariant;
  }

  handleToggleCheckboxButtonClick(event) {
    const checkbox = this.getComponent("toggleCheckbox");
    checkbox.toggle();
  }

  handleAddTabButtonClick() {
    this.state.dynamicTabs = this.state.dynamicTabs.concat({
      timestamp: "" + new Date()
    });
  }

  async handleFindDb() {
    const data = await fetch_post('/notion/databases');
    console.log(data);
  }

  async handleGetDbInfo() {
    const data = await fetch_get('/notion/databases');
    console.log(data);

    const initialSchema = {
      game: data.properties.Game.multi_select.options,
    };

    this.state.schema = await fetchSchema(initialSchema);
  }

  async handleCreatePage() {
    const data = await fetch_post('/notion/pages');
    console.log(data);
  }

  async handleSaveTagsGame() {
    const tableObj = this.getEl("list_tags_game");
    var selectedTags = []
    for (const obj of tableObj.querySelectorAll('tbody input[type="checkbox"]')) {
      if (obj.checked) {
        selectedTags.push(obj.id);
      }
    }
    await fetch_post('/db/create_page', { tags_game: selectedTags });
    this.state.schema = await fetchSchema(this.state.schema);
  }
};
