function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generatePackID() {
    document.getElementById('pack_id').value = generateUUID();
}

function addType() {
    const typesContainer = document.getElementById('typesContainer');
    const typeItem = document.createElement('div');
    typeItem.className = 'type-item';

    typeItem.innerHTML = `
        <input type="text" class="type-input" placeholder="Type Name">
        <button type="button" class="remove-type-btn" onclick="removeType(this)">Remove</button>
    `;
    
    typesContainer.appendChild(typeItem);
}

function removeType(button) {
    const typeItem = button.parentElement;
    typeItem.remove();
}

function getTypes() {
    const typesContainer = document.getElementById('typesContainer');
    const typeInputs = typesContainer.getElementsByClassName('type-input');
    return Array.from(typeInputs).map(input => input.value).filter(value => value !== '');
}

function formatType(type) {
    return type.toLowerCase().replace(/\s+/g, '_');
}

function addSign() {
    const signsContainer = document.getElementById('signsContainer');
    const signBlock = document.createElement('div');
    signBlock.className = 'sign-block';

    const types = getTypes();
    const typeOptions = types.map(type => `<option value="${formatType(type)}">${type}</option>`).join('');

    signBlock.innerHTML = `
        <div class="form-group">
            <label for="sign_name">Sign Name</label>
            <input type="text" class="sign_name" required>
        </div>
        <div class="form-group">
            <label for="sign_type">Sign Type</label>
            <select class="sign_type" required>
                ${typeOptions}
            </select>
        </div>
        <div class="form-group">
            <label for="sign_front">Front Image</label>
            <input type="text" class="sign_front" required>
        </div>
        <div class="form-group">
            <label for="sign_back">Back Image</label>
            <input type="text" class="sign_back" required>
        </div>
        <div class="form-group">
            <label for="sign_textlines">Text Lines</label>
            <div class="textlinesContainer"></div>
            <button type="button" onclick="addTextline(this)">Add Textline</button>
        </div>
        <button type="button" class="remove-sign-btn" onclick="removeSign(this)">Remove Sign</button>
    `;

    signBlock.dataset.id = generateUUID();
    signsContainer.appendChild(signBlock);
}

function removeSign(button) {
    const signBlock = button.parentElement;
    signBlock.remove();
}

function addTextline(button) {
    const textlinesContainer = button.previousElementSibling;
    const textlineItem = document.createElement('div');
    textlineItem.className = 'textline-item';

    textlineItem.innerHTML = `
        <label>Label</label>
        <input type="text" class="textline-input" placeholder="Label" required>
        <label>x</label>
        <input type="number" class="short-input" placeholder="x" required>
        <label>y</label>
        <input type="number" class="short-input" placeholder="y" required>
        <label>width</label>
        <input type="number" class="short-input" placeholder="width" required>
        <label>maxlength</label>
        <input type="number" class="short-input" placeholder="maxlength" required>
        <label>xscale</label>
        <input type="number" class="short-input" placeholder="xscale" required>
        <label>yscale</label>
        <input type="number" class="short-input" placeholder="yscale" required>
        <label>halign</label>
        <input type="text" class="short-input" placeholder="halign" required>
        <label>valign</label>
        <input type="text" class="short-input" placeholder="valign" required>
        <label>color</label>
        <input type="number" class="short-input" placeholder="color" required>
        <button type="button" class="remove-textline-btn" onclick="removeTextline(this)">Remove</button>
    `;

    textlinesContainer.appendChild(textlineItem);
}

function removeTextline(button) {
    const textlineItem = button.parentElement;
    textlineItem.remove();
}

function generateJSON() {
    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const pack_id = document.getElementById('pack_id').value;

    const types = getTypes();
    const typesObject = {};
    types.forEach(type => {
        typesObject[formatType(type)] = type;
    });

    const signsContainer = document.getElementById('signsContainer');
    const signBlocks = signsContainer.getElementsByClassName('sign-block');

    const signs = Array.from(signBlocks).map(signBlock => {
        const id = signBlock.dataset.id;
        const name = signBlock.querySelector('.sign_name').value;
        const type = signBlock.querySelector('.sign_type').value;
        const front = signBlock.querySelector('.sign_front').value;
        const back = signBlock.querySelector('.sign_back').value;
        const textlinesContainer = signBlock.querySelector('.textlinesContainer');
        const textlineItems = textlinesContainer.getElementsByClassName('textline-item');

        const textlines = Array.from(textlineItems).map(textlineItem => {
            const inputs = textlineItem.getElementsByClassName('textline-input');
            return {
                label: inputs[0].value,
                x: parseFloat(inputs[1].value),
                y: parseFloat(inputs[2].value),
                width: parseFloat(inputs[3].value),
                maxlength: parseInt(inputs[4].value),
                xscale: parseFloat(inputs[5].value),
                yscale: parseFloat(inputs[6].value),
                halign: inputs[7].value,
                valign: inputs[8].value,
                color: parseInt(inputs[9].value)
            };
        });

        return {
            id: id,
            name: name,
            type: formatType(type),
            front: front,
            back: back,
            textlines: textlines
        };
    });

    const signPack = {
        name: name,
        author: author,
        pack_id: pack_id,
        types: typesObject,
        signs: signs
    };

    const jsonOutput = JSON.stringify(signPack, null, 4);
    document.getElementById('output').textContent = jsonOutput;
    return jsonOutput;
}

function downloadJSON() {
    const jsonOutput = generateJSON();
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sign_pack.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
