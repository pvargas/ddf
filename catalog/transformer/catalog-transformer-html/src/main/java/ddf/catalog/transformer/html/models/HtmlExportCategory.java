/**
 * Copyright (c) Codice Foundation
 *
 * <p>This is free software: you can redistribute it and/or modify it under the terms of the GNU
 * Lesser General Public License as published by the Free Software Foundation, either version 3 of
 * the License, or any later version.
 *
 * <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public
 * License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package ddf.catalog.transformer.html.models;

import ddf.catalog.data.Metacard;
import java.util.List;
import java.util.Map;

/**
 * <b> This code is experimental. While this interface is functional and tested, it may change or be
 * removed in a future version of the library. </b>
 *
 * <p>Every category in an HTML export must implement this interface for it to be configurable
 * through the admin UI.
 */
public interface HtmlExportCategory {

  void setTitle(String title);

  String getTitle();

  void setAttributes(List<String> attributes);

  List<String> getAttributes();

  void applyAttributeMappings(Metacard metacard);

  Map<String, HtmlValueModel> getAttributeMappings();
}
