# TFG Anvil Calculator

Welcome to the TFG Anvil Calculator! This tool helps you determine the most efficient sequence of smithing actions 
to always get a perfectly forged item in the TerraFirmaGreg modpack.

Link to the tool: https://adrianmiller99.github.io/tfg-anvil-calculator/src/index.html


## How to Use



### 1. Choose Smithing Instructions
Select up to three smithing instructions from the provided options:
- **Punch**
- **Bend**
- **Upset**
- **Shrink**
- **Hit**
- **Draw**
- **None** (if fewer than three instructions are needed)

For each instruction, assign a priority (Last, Second Last, Third Last, Not Last, Any).


**Make sure that the instructions and their priorities are matching those of the in-game anvil GUI.**

### 2. Set Your Target Value
Unless I'm mistaken, you can't actually see the target value in-game, unless you use a resource pack like
[this](https://www.curseforge.com/minecraft/texture-packs/tfc-tng-anvilgui-easy-smithing).
Once you have the resource pack installed, you can see the target value in the anvil GUI.
With this target value, you can now use the calculator.
Enter the target value you see in the in-game anvil GUI in the input field labeled "Target Value" on the calculator.

### 3. Calculate
Click the "Calculate" button to generate the most efficient setup and final instructions. The results will be displayed below, 
showing the necessary smithing actions as images.

The resulting actions that you need to perform in-game are divided into two sections:
- **Setup**: The initial setup actions that you need to perform to reach the _pre-target value_. 
This is the value you need to reach before you can start performing the final actions which are dictated to you by the instructions.
The order of these actions is irrelevant.
- **Finally**: The final actions that you need to perform to reach the target value. After performing these actions in 
the order shown on the calculator (left to right, top to bottom), you should have a perfectly forged item.

### 4. Switch Between Light and Dark Modes
Use the toggle switch in the top right corner to switch between light and dark modes according to your preference.

## Support
If you encounter any issues or have suggestions for improvements, 
feel free to open an issue on the [GitHub repository](https://github.com/AdrianMiller99/tfg-anvil-calculator).

If you feel like this tool has helped you and you want to support me, 
you can do so by buying me a coffee on [Ko-fi](https://ko-fi.com/adrianmiller99) or by simply giving the repository a star.

# License
This project is licensed under the European Union Public Licence (EUPL) 1.2. See the LICENSE file for details.