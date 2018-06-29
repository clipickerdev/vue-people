import { state, getters, actions, mutations } from '~/store/map';

test('map state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('isAddMode', () => {
    expect(getters.isAddMode(s)).toEqual(s.addMode);
  });

  test('getMapReady', () => {
    expect(getters.getMapReady(s)).toEqual(s.mapReady);
  });

  test('getPins', () => {
    const rootGetters = {
      'people/getList': [
        {id: 1, type: 1, latlng: {}},
        {id: 2, type: 2, latlng: {}},
        {id: 3, type: 2}
      ]
    };
    const result = getters.getPins(null, null, null, rootGetters);
    expect(result.length).toBe(2);
  });

  test('getFilteredPins', () => {
    const g = {
      getFocusOn: 1,
      getPins: [
        {id: 1, type: 1, latlng: {}},
        {id: 2, type: 2, latlng: {}}
      ]
    };
    const rootGetters = {
      'people/getSelectedTags': [],
      getSelectedUserTypes: []
    };
    let result = getters.getFilteredPins(null, g, null, rootGetters);
    expect(result).toEqual([]);

    rootGetters.getSelectedUserTypes = [2];
    result = getters.getFilteredPins(null, g, null, rootGetters);
    expect(result.length).toEqual(1);

    rootGetters.getSelectedUserTypes = [1, 2];

    rootGetters['people/getSelectedTags'] = ['vuex'];
    g.getPins = [
      {id: 1, type: 1, tags: ['vuex'], latlng: {}},
      {id: 2, type: 2, tags: [], latlng: {}}
    ];
    result = getters.getFilteredPins(null, g, null, rootGetters);
    expect(result[0]).toEqual({id: 1, type: 1, key: 1, options: {}, tags: ['vuex'], latlng: {}});
    expect(result.length).toEqual(1);
  });

  test('getShownPins', () => {
    const getPins = [{type: 1}, {type: 1}, {type: 2}];
    const getUserTypes = [{id: 1}, {id: 2}];
    const getUserProfile = {type: 1};
    expect(getters.getShownPins(
      null,
      { getPins },
      null,
      { getUserTypes, 'user/getUserProfile': getUserProfile }
    ))
      .toEqual({1: 2, 2: 1});

    getUserProfile.latlng = [];
    expect(getters.getShownPins(
      null,
      { getPins },
      null,
      { getUserTypes, 'user/getUserProfile': getUserProfile }
    ))
      .toEqual({1: 3, 2: 1});
    expect(getters.getShownPins(null, {}, null, {getUserTypes}))
      .toEqual({1: 0, 2: 0});
  });

  test('getShowMeetups', () => {
    expect(getters.getShowMeetups(s)).toEqual(s.showMeetups);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
  });

  test('setAddMode', () => {
    actions.setAddMode(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_ADD_MODE', 1);
  });

  test('setMapReady', () => {
    actions.setMapReady(vuex);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_MAP_READY', true);
  });

  test('setShowMeetups', () => {
    actions.setShowMeetups(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_SHOW_MEETUPS', 1);
  });
});

describe('mutations', () => {
  test('SET_ADD_MODE', () => {
    const s = {};
    mutations.SET_ADD_MODE(s, 1);
    expect(s.addMode).toEqual(1);
  });
  test('SET_MAP_READY', () => {
    const s = {};
    mutations.SET_MAP_READY(s, 1);
    expect(s.mapReady).toEqual(1);
  });
  test('SET_SHOW_MEETUPS', () => {
    const s = {};
    mutations.SET_SHOW_MEETUPS(s, 1);
    expect(s.showMeetups).toEqual(1);
  });
});
